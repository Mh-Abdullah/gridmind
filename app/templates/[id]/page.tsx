"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { BackToTablesButton } from "@/components/back-to-tables-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { Loader2, ExternalLink, Menu, Link as LinkIcon, Type, Hash } from "lucide-react"
import { PREDEFINED_TEMPLATES, CATEGORY_COLORS, CATEGORY_DOT_COLORS } from "@/lib/templates-data"

function getColumnIcon(colName: string) {
  const lower = colName.toLowerCase()
  if (lower.includes("url") || lower.includes("website") || lower.includes("linkedin") || lower.includes("profile")) {
    return <LinkIcon className="h-3 w-3 text-muted-foreground" />
  }
  if (lower.includes("score") || lower.includes("id") || lower.includes("count")) {
    return <Hash className="h-3 w-3 text-muted-foreground" />
  }
  return <Type className="h-3 w-3 text-muted-foreground" />
}

function isUrl(value: string) {
  try {
    new URL(value)
    return value.startsWith("http")
  } catch {
    return false
  }
}

export default function TemplatePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const template = PREDEFINED_TEMPLATES.find((t) => t.id === id)

  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)

  if (!template) {
    // Soft redirect instead of throwing notFound in client component
    router.push("/templates")
    return null
  }

  const handleTurnIntoProject = async () => {
    if (!user?.id) {
      router.push("/login")
      return
    }
    setIsCreating(true)
    try {
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name: template.title })

      const cells: { cellKey: string; value: string }[] = []
      template.sampleRows.forEach((row, ri) => {
        template.columns.forEach((col, ci) => {
          if (row[col]) cells.push({ cellKey: `${ri}-${ci}`, value: row[col] })
        })
      })

      const names = template.columns.map((col, ci) => ({ colIndex: ci, name: col }))
      await updateColumnNames({ spreadsheetId, names })
      if (cells.length > 0) await batchUpdateCells({ spreadsheetId, cells })
      await updateMetadata({
        spreadsheetId,
        numRows: template.sampleRows.length,
        numCols: template.columns.length,
      })

      router.push(`/dashboard/tables/${tableId}`)
    } catch (err) {
      console.error("Failed to create table:", err)
      alert(err instanceof Error ? err.message : "Failed to create table from template.")
      setIsCreating(false)
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="border-b border-border bg-background px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <BackToTablesButton />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">Templates</p>
              <h1 className="text-lg font-semibold text-foreground">{template.title}</h1>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">

            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-3">Template: {template.title}</h1>
              <Button
                onClick={handleTurnIntoProject}
                disabled={isCreating}
                className="gap-2"
              >
                {isCreating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Creating…</>
                ) : (
                  <><ExternalLink className="h-4 w-4" />Turn into Project</>
                )}
              </Button>
              <p className="mt-4 text-sm text-muted-foreground max-w-2xl">{template.description}</p>
            </div>

            {/* Category tags */}
            <div className="flex items-center gap-2 mb-6">
              {template.categories.map((cat) => (
                <span key={cat} className={cn("flex items-center gap-1.5 text-xs font-medium", CATEGORY_COLORS[cat] ?? "text-muted-foreground")}>
                  <span className={cn("h-2 w-2 rounded-full", CATEGORY_DOT_COLORS[cat] ?? "bg-muted-foreground")} />
                  {cat}
                </span>
              ))}
              <span className="text-xs text-muted-foreground">· {template.columns.length} columns</span>
            </div>

            {/* Preview spreadsheet */}
            <div className="rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {/* Column headers */}
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="w-12 px-3 py-2.5 text-left text-xs font-medium text-muted-foreground border-r border-border">ID</th>
                      {template.columns.map((col) => (
                        <th key={col} className="px-3 py-2.5 text-left border-r border-border last:border-r-0 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            {getColumnIcon(col)}
                            {col}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Sample rows */}
                  <tbody>
                    {template.sampleRows.map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2.5 text-xs text-muted-foreground border-r border-border">{i + 1}</td>
                        {template.columns.map((col) => (
                          <td key={col} className="px-3 py-2.5 border-r border-border last:border-r-0 max-w-50">
                            {isUrl(row[col] ?? "") ? (
                              <a
                                href={row[col]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline truncate"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span className="truncate">{row[col]}</span>
                              </a>
                            ) : (
                              <span className="text-xs text-foreground truncate block">{row[col] ?? ""}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* "Add your data" placeholder row */}
                    <tr className="border-b border-border bg-muted/10">
                      <td className="px-3 py-2.5 text-xs text-muted-foreground border-r border-border">
                        {template.sampleRows.length + 1}
                      </td>
                      <td className="px-3 py-2.5 border-r border-border" colSpan={template.columns.length}>
                        <span className="text-xs text-muted-foreground/60 italic">
                          ← ADD YOUR DATA HERE
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 flex items-center gap-4">
              <Button onClick={handleTurnIntoProject} disabled={isCreating} className="gap-2">
                {isCreating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Creating spreadsheet…</>
                ) : (
                  <><ExternalLink className="h-4 w-4" />Turn into Project</>
                )}
              </Button>
              <Link href="/templates">
                <Button variant="ghost">← Back to Templates</Button>
              </Link>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
