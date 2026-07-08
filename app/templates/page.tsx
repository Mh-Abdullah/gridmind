"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BackToTablesButton } from "@/components/back-to-tables-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import {
  Wand2,
  Loader2,
  X,
  ArrowRight,
  Sparkles,
  Menu,
  ExternalLink,
} from "lucide-react"
import {
  PREDEFINED_TEMPLATES,
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_DOT_COLORS,
  type Template,
} from "@/lib/templates-data"

interface GeneratedTemplate {
  title: string
  description: string
  category: string
  columns: string[]
  sampleRows: Record<string, string>[]
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({ template }: { template: Template }) {
  const router = useRouter()

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-border bg-card p-5 cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
      onClick={() => router.push(`/templates/${template.id}`)}
    >
      {/* Subtle gradient glow at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-primary/4 to-transparent" />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-foreground leading-snug">{template.title}</h3>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {template.categories.map((cat) => (
            <span key={cat} className={cn("flex items-center gap-1 text-xs font-medium", CATEGORY_COLORS[cat] ?? "text-muted-foreground")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", CATEGORY_DOT_COLORS[cat] ?? "bg-muted-foreground")} />
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {template.description}
      </p>

      {/* Preview link — appears on hover */}
      <div className="mt-3 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          Preview <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  )
}

// ─── Preview Table ────────────────────────────────────────────────────────────

function PreviewTable({ columns, sampleRows }: { columns: string[]; sampleRows: Record<string, string>[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="w-10 px-3 py-2 text-left text-muted-foreground font-medium">ID</th>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 text-left text-muted-foreground font-medium whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleRows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
              <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 text-foreground whitespace-nowrap max-w-40 truncate">
                  {row[col] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── AI Preview Modal ─────────────────────────────────────────────────────────

function AIPreviewModal({
  template,
  isCreating,
  onClose,
  onTurnIntoProject,
  onRegenerate,
}: {
  template: GeneratedTemplate
  isCreating: boolean
  onClose: () => void
  onTurnIntoProject: () => void
  onRegenerate: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl flex flex-col">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Generated Template</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{template.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Category + columns summary */}
        <div className="px-6 py-4 border-b border-border flex items-center gap-4 flex-wrap">
          <span className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            CATEGORY_COLORS[template.category] ?? "text-muted-foreground"
          )}>
            <span className={cn("h-2 w-2 rounded-full", CATEGORY_DOT_COLORS[template.category] ?? "bg-muted-foreground")} />
            {template.category}
          </span>
          <span className="text-xs text-muted-foreground">{template.columns.length} columns · {template.sampleRows.length} sample rows</span>
        </div>

        {/* Preview table */}
        <div className="p-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Preview</p>
          <PreviewTable columns={template.columns} sampleRows={template.sampleRows} />
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <Button
            onClick={onTurnIntoProject}
            disabled={isCreating}
            className="gap-2"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            {isCreating ? "Creating spreadsheet…" : "Turn into Project"}
          </Button>
          <Button variant="outline" onClick={onRegenerate} disabled={isCreating}>
            Regenerate
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedTemplate | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [generateError, setGenerateError] = useState("")

  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)

  // Filter templates by category
  const filteredTemplates =
    activeCategory === "All"
      ? PREDEFINED_TEMPLATES
      : PREDEFINED_TEMPLATES.filter((t) => t.categories.includes(activeCategory))

  // Generate AI template
  const handleGenerate = async () => {
    if (!description.trim()) return
    setIsGenerating(true)
    setGenerateError("")
    try {
      const res = await fetch("/api/ai/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      })
      if (!res.ok) throw new Error("Generation failed")
      const data = await res.json()
      setGeneratedTemplate(data)
      setShowAIModal(true)
    } catch {
      setGenerateError("Failed to generate template. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Create spreadsheet from template data
  const createTableFromTemplate = async (template: {
    title: string
    columns: string[]
    sampleRows: Record<string, string>[]
  }) => {
    if (!user?.id) return
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
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
            <button
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <BackToTablesButton />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">Workspace</p>
              <h1 className="text-lg font-semibold text-foreground">Templates</h1>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

            {/* ── AI Generator ─────────────────────────────────────── */}
            <section>
              <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/3 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">Generate a Custom Template with AI</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Describe what data you want to collect and we&apos;ll build the columns and sample rows for you.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                    placeholder="e.g. track job applicants with their skills and interview stages…"
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                    disabled={isGenerating}
                  />
                  <Button onClick={handleGenerate} disabled={isGenerating || !description.trim()} className="gap-2 shrink-0">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Generate Template
                      </>
                    )}
                  </Button>
                </div>
                {generateError && (
                  <p className="mt-2 text-xs text-destructive">{generateError}</p>
                )}
              </div>
            </section>

            {/* ── Templates ─────────────────────────────────────────── */}
            <section>
              <h2 className="mb-5 text-lg font-bold text-foreground">Templates</h2>

              {/* Category filter */}
              <div className="flex items-center gap-1.5 flex-wrap mb-6">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
                {filteredTemplates.length === 0 && (
                  <p className="col-span-3 text-center text-sm text-muted-foreground py-12">
                    No templates in this category yet.
                  </p>
                )}
              </div>
            </section>

            {/* ── My Templates ─────────────────────────────────────── */}
            <section className="pb-8">
              <h2 className="text-lg font-bold text-foreground mb-2">My Templates</h2>
              <p className="text-sm text-muted-foreground">
                Start by turning one of your projects into a template.{" "}
                <Link href="/dashboard/tables" className="text-primary hover:underline">
                  Go to Tables →
                </Link>
              </p>
            </section>

          </div>
        </main>
      </div>

      {/* AI Preview Modal */}
      {showAIModal && generatedTemplate && (
        <AIPreviewModal
          template={generatedTemplate}
          isCreating={isCreating}
          onClose={() => {
            if (!isCreating) {
              setShowAIModal(false)
            }
          }}
          onTurnIntoProject={() => createTableFromTemplate(generatedTemplate)}
          onRegenerate={() => {
            setShowAIModal(false)
            setGeneratedTemplate(null)
          }}
        />
      )}
    </div>
  )
}
