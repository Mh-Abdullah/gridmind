"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Table2, Search, Wand2, Upload, MapPin, PlaySquare, FolderPlus, Trash2, X, CheckCircle2, Menu, ArrowRight, Loader2, ExternalLink, Sparkles } from "lucide-react"
import { PREDEFINED_TEMPLATES, ALL_CATEGORIES, CATEGORY_COLORS, CATEGORY_DOT_COLORS } from "@/lib/templates-data"
import { cn } from "@/lib/utils"
import LocalBusinessesModal from "@/components/local-businesses-modal"
import GoogleSearchModal from "@/components/google-search-modal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useRef, useState, useCallback } from "react"
import { useQuery, useMutation } from "convex/react"
import * as XLSX from "xlsx"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export default function TablesPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showNameModal, setShowNameModal] = useState(false)
  const [newTableName, setNewTableName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // CSV import modal state
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<{ name: string; headers: string[]; rows: string[][] } | null>(null)
  const [importName, setImportName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const importFileRef = useRef<HTMLInputElement>(null)

  // Template search modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateCategory, setTemplateCategory] = useState("All")
  const [previewedTemplate, setPreviewedTemplate] = useState<typeof PREDEFINED_TEMPLATES[number] | null>(null)

  // AI creator modal state
  const [showCreatorModal, setShowCreatorModal] = useState(false)
  const [creatorDescription, setCreatorDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTemplate, setGeneratedTemplate] = useState<{ title: string; description: string; category: string; columns: string[]; sampleRows: Record<string, string>[] } | null>(null)
  const [generateError, setGenerateError] = useState("")

  // Local businesses modal state
  const [showLocalModal, setShowLocalModal] = useState(false)

  // Google Search modal state
  const [showGoogleSearchModal, setShowGoogleSearchModal] = useState(false)

  // Fetch user's spreadsheets from Convex
  const spreadsheets = useQuery(
    api.spreadsheets.getSpreadsheetsByUser,
    user?.id ? { userId: user.id } : "skip"
  )

  // Mutations
  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const deleteSpreadsheet = useMutation(api.spreadsheets.deleteSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)

  // Process any pending import saved from the landing page
  useEffect(() => {
    if (loading || !user?.id) return
    const raw = localStorage.getItem("pendingImport")
    if (!raw) return
    localStorage.removeItem("pendingImport")

    let parsed: { csvData: { headers: string[]; rows: string[][] }; sheetName: string } | null = null
    try { parsed = JSON.parse(raw) } catch { return }
    if (!parsed) return

    const { csvData, sheetName } = parsed
    const name = sheetName || "Untitled Sheet"

    const run = async () => {
      try {
        const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name })

        const cells: { cellKey: string; value: string }[] = []
        csvData.rows.forEach((row: string[], ri: number) => {
          row.forEach((val: string, ci: number) => { if (val.trim()) cells.push({ cellKey: `${ri}-${ci}`, value: val }) })
        })

        const names = csvData.headers
          .map((h: string, ci: number) => ({ colIndex: ci, name: h.trim() }))
          .filter((n: { colIndex: number; name: string }) => n.name !== "")
        if (names.length > 0) await updateColumnNames({ spreadsheetId, names })
        if (cells.length > 0) await batchUpdateCells({ spreadsheetId, cells })
        await updateMetadata({ spreadsheetId, numRows: csvData.rows.length, numCols: csvData.headers.length })

        router.push(`/dashboard/tables/${tableId}`)
      } catch (err) {
        console.error("Failed to process pending import:", err)
      }
    }
    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id])

  // Protect the page - only logged in regular users can access
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
    if (!loading && user?.role === "admin") {
      router.push("/dashboard-admin")
    }
  }, [user, loading, router])

  const handleCreateTable = async () => {
    if (!newTableName.trim() || !user?.id) return
    
    setIsCreating(true)
    try {
      // Generate a unique tableId
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      await createSpreadsheet({
        tableId,
        userId: user.id,
        name: newTableName.trim(),
      })
      
      setShowNameModal(false)
      setNewTableName("")
      
      // Navigate to the new table
      router.push(`/dashboard/tables/${tableId}`)
    } catch (error) {
      console.error("Failed to create table:", error)
    } finally {
      setIsCreating(false)
    }
  }

  // ── CSV parsing ──
  const parseAndSetFile = useCallback(async (file: File) => {
    const baseName = file.name.replace(/\.(csv|xlsx|xls|txt)$/i, "")
    try {
      let headers: string[] = []
      let rows: string[][] = []

      if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        const text = await file.text()
        const lines = text.trim().split("\n")
        headers = lines[0]?.split(",").map((h) => h.replace(/^"|"$/g, "").trim()) ?? []
        rows = lines.slice(1).map((line) => line.split(",").map((c) => c.replace(/^"|"$/g, "").trim()))
      } else {
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(new Uint8Array(buf), { type: "array" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
        const allRows: string[][] = []
        for (let r = range.s.r; r <= range.e.r; r++) {
          const row: string[] = []
          for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c })
            row.push(ws[addr] ? String(ws[addr].v ?? "") : "")
          }
          allRows.push(row)
        }
        headers = allRows[0] ?? []
        rows = allRows.slice(1)
      }

      setImportFile({ name: file.name, headers, rows })
      setImportName(baseName)
    } catch {
      alert("Could not parse file. Please use CSV or Excel format.")
    }
  }, [])

  const handleImportDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) parseAndSetFile(file)
  }, [parseAndSetFile])

  const handleStartImport = async () => {
    if (!importFile || !importName.trim() || !user?.id) return
    setIsImporting(true)
    try {
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name: importName.trim() })

      const cells: { cellKey: string; value: string }[] = []
      importFile.rows.forEach((row, ri) => {
        row.forEach((val, ci) => { if (val.trim()) cells.push({ cellKey: `${ri}-${ci}`, value: val }) })
      })

      const names = importFile.headers
        .map((h, ci) => ({ colIndex: ci, name: h.trim() }))
        .filter((n) => n.name !== "")
      if (names.length > 0) await updateColumnNames({ spreadsheetId, names })
      if (cells.length > 0) await batchUpdateCells({ spreadsheetId, cells })
      await updateMetadata({ spreadsheetId, numRows: importFile.rows.length, numCols: importFile.headers.length })

      setShowImportModal(false)
      setImportFile(null)
      setImportName("")
      router.push(`/dashboard/tables/${tableId}`)
    } catch (err) {
      console.error("Import failed:", err)
      setIsImporting(false)
    }
  }

  const handleDeleteTable = async (spreadsheetId: Id<"spreadsheets">) => {
    if (!confirm("Are you sure you want to delete this table? This action cannot be undone.")) {
      return
    }
    
    try {
      await deleteSpreadsheet({ spreadsheetId })
    } catch (error) {
      console.error("Failed to delete table:", error)
    }
  }

  const formatDate = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // ── Template helpers ──
  const filteredTemplates = templateCategory === "All"
    ? PREDEFINED_TEMPLATES
    : PREDEFINED_TEMPLATES.filter((t) => t.categories.includes(templateCategory))

  const createTableFromTemplate = async (tpl: { title: string; columns: string[]; sampleRows: Record<string, string>[] }) => {
    if (!user?.id) return
    setIsCreating(true)
    try {
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name: tpl.title })
      const cells: { cellKey: string; value: string }[] = []
      tpl.sampleRows.forEach((row, ri) => tpl.columns.forEach((col, ci) => { if (row[col]) cells.push({ cellKey: `${ri}-${ci}`, value: row[col] }) }))
      const names = tpl.columns.map((col, ci) => ({ colIndex: ci, name: col }))
      await updateColumnNames({ spreadsheetId, names })
      if (cells.length > 0) await batchUpdateCells({ spreadsheetId, cells })
      await updateMetadata({ spreadsheetId, numRows: tpl.sampleRows.length, numCols: tpl.columns.length })
      router.push(`/dashboard/tables/${tableId}`)
    } catch (err) {
      console.error("Failed to create table:", err)
      setIsCreating(false)
    }
  }

  const handleGenerate = async () => {
    if (!creatorDescription.trim()) return
    setIsGenerating(true)
    setGenerateError("")
    setGeneratedTemplate(null)
    try {
      const res = await fetch("/api/ai/generate-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: creatorDescription.trim() }),
      })
      if (!res.ok) throw new Error("Generation failed")
      setGeneratedTemplate(await res.json())
    } catch {
      setGenerateError("Failed to generate. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const projectOptions = [
    { icon: Table2, label: "Blank table", description: "Start with an empty table", action: () => setShowNameModal(true) },
    { icon: Search, label: "Search templates", description: "Browse pre-built templates", action: () => { setPreviewedTemplate(null); setShowTemplateModal(true) } },
    { icon: Wand2, label: "Creator", description: "AI-powered table generation", action: () => { setGeneratedTemplate(null); setCreatorDescription(""); setGenerateError(""); setShowCreatorModal(true) } },
    { icon: Upload, label: "Import & enrich CSV", description: "Upload and enhance your data", action: () => setShowImportModal(true) },
    { icon: PlaySquare, label: "Run Google Search", description: "Search and extract data", action: () => setShowGoogleSearchModal(true) },
    { icon: MapPin, label: "Local businesses", description: "Find nearby businesses", action: () => setShowLocalModal(true) },
  ]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AppSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-background px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">Workspace</p>
              <h1 className="text-lg font-semibold text-foreground">Tables</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={() => setShowNameModal(true)}
              size="sm"
              className="gap-1.5 text-sm"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              <span className="hidden sm:inline">New table</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 md:px-8 py-6 md:py-10">

          {/* ── Hero ── */}
          <div className="relative mb-8 md:mb-14 overflow-hidden rounded-2xl border border-border bg-card">
            {/* Ambient layers */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-10%,hsl(var(--primary)/0.07),transparent)]" />
              <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle,var(--foreground) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
              <div className="absolute -top-12 right-10 h-52 w-52 rounded-full bg-primary/9 blur-3xl animate-[gm-float_7s_ease-in-out_infinite]" />
              <div className="absolute top-8 right-56 h-28 w-28 rounded-full bg-accent/[0.07] blur-2xl animate-[gm-float_9s_ease-in-out_infinite_2s]" />
            </div>

            <div className="relative px-4 md:px-8 py-6 md:py-10">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

                {/* Left */}
                <div>
                  {/* Live date pill */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm px-3 py-1 mb-6">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-[2.6rem] font-bold tracking-tight leading-[1.08] text-foreground">
                    Good{" "}
                    {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
                    <br />
                    <span className="text-foreground">
                      {user?.name}.
                    </span>
                  </h2>

                  <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
                    {spreadsheets === undefined
                      ? "Loading your workspace…"
                      : spreadsheets.length === 0
                      ? "Your workspace is empty. Create your first table to get started."
                      : `You have ${spreadsheets.length} table${spreadsheets.length !== 1 ? "s" : ""} in your workspace. Ready to enrich?`}
                  </p>
                </div>

                {/* Right: stat strip */}
                <div className="flex items-stretch gap-px rounded-xl border border-border overflow-hidden bg-border shrink-0 self-start lg:self-end">
                  {[
                    { value: spreadsheets?.length ?? "—", label: "Tables" },
                    { value: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), label: "Today" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center justify-center px-7 py-4 bg-card hover:bg-muted/50 transition-colors">
                      <span className="text-2xl font-bold text-foreground tabular-nums">{s.value}</span>
                      <span className="text-[11px] text-muted-foreground mt-0.5 tracking-wide">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animated shimmer rule */}
              <div className="mt-8 h-px w-full bg-border overflow-hidden rounded-full">
                <div className="h-full w-2/5 bg-linear-to-r from-transparent via-primary/50 to-transparent animate-[gm-shimmer_3.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>

          {/* ── Start something new ── */}
          <section className="mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
              Start something new
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {projectOptions.map((option, i) => (
                <button
                  key={option.label}
                  style={{ animationDelay: `${i * 55}ms` }}
                  onClick={() => option.action()}
                  className="group relative overflow-hidden flex flex-col gap-3 rounded-xl border border-border bg-background p-4 text-left
                    transition-all duration-200 ease-out
                    hover:border-primary/30 hover:-translate-y-1
                    hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.12)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
                    animate-[gm-tilein_0.4s_ease_both]"
                >
                  {/* Hover radial glow */}
                  <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Icon */}
                  <div className="relative h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground
                    group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110
                    transition-all duration-200">
                    <option.icon className="h-4 w-4" />
                  </div>

                  {/* Text */}
                  <div className="relative">
                    <p className="text-[12px] font-semibold text-foreground leading-snug tracking-tight">{option.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{option.description}</p>
                  </div>

                  {/* Sweep accent line */}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary/80 to-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left rounded-b-xl" />

                  {/* Top-right arrow */}
                  <svg
                    className="absolute top-3 right-3 h-3 w-3 text-primary/0 group-hover:text-primary/60 transition-all duration-200 translate-x-1 group-hover:translate-x-0 translate-y-1 group-hover:translate-y-0"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </button>
              ))}
            </div>
          </section>

          {/* ── Projects list ── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Projects &amp; Folders</p>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <FolderPlus className="h-3.5 w-3.5" />
                New folder
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_100px_36px] sm:grid-cols-[1fr_60px_100px_36px] gap-4 px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 border-b border-border">
              <span>Name</span>
              <span className="hidden sm:block text-right">Cols</span>
              <span className="text-right">Updated</span>
              <span />
            </div>

            {spreadsheets === undefined ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : spreadsheets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-4 border border-border">
                  <Table2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">No tables yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">Create your first table or import a CSV file to get started.</p>
                <button onClick={() => setShowNameModal(true)} className="mt-5 text-xs text-primary hover:underline underline-offset-4 font-medium">
                  Create blank table →
                </button>
              </div>
            ) : (
              <div>
                {spreadsheets.map((sheet, i) => (
                  <div
                    key={sheet._id}
                    onClick={() => router.push(`/dashboard/tables/${sheet.tableId}`)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="group relative grid grid-cols-[1fr_100px_36px] sm:grid-cols-[1fr_60px_100px_36px] gap-4 items-center px-4 py-3.5
                      border-b border-border/50 last:border-b-0 cursor-pointer
                      hover:bg-muted/25 transition-colors duration-150
                      animate-[gm-tilein_0.35s_ease_both]"
                  >
                    {/* Left accent bar */}
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center" />

                    <div className="flex items-center gap-3 min-w-0 pl-1">
                      <div className="shrink-0 h-7 w-7 rounded-md bg-muted border border-border flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-150">
                        <svg className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M3 15h18M9 3v18" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-150">{sheet.name}</span>
                    </div>
                    <span className="hidden sm:block text-xs text-muted-foreground text-right tabular-nums">{sheet.numCols}</span>
                    <span className="text-xs text-muted-foreground text-right">{formatDate(sheet.updatedAt)}</span>
                    <div className="flex justify-end">
                      <button
                        className="h-7 w-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                        onClick={(e) => { e.stopPropagation(); handleDeleteTable(sheet._id) }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ── Google Search Modal ── */}
      {showGoogleSearchModal && <GoogleSearchModal onClose={() => setShowGoogleSearchModal(false)} />}

      {/* ── Local Businesses Modal ── */}
      {showLocalModal && <LocalBusinessesModal onClose={() => setShowLocalModal(false)} />}

      {/* ── Search Templates Modal ── */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-border bg-background shadow-2xl flex flex-col max-h-[85vh]">

            {/* ─ Grid view ─ */}
            {!previewedTemplate ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Search Templates</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Click a template to preview it before using.</p>
                  </div>
                  <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted" onClick={() => setShowTemplateModal(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-1.5 flex-wrap px-6 py-3 border-b border-border shrink-0">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategory(cat)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-all",
                        templateCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Template grid */}
                <div className="overflow-y-auto flex-1 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="group relative flex flex-col rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all duration-200"
                        onClick={() => setPreviewedTemplate(tpl)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-[13px] font-semibold text-foreground leading-snug">{tpl.title}</h4>
                          <div className="flex flex-col items-end gap-0.5 shrink-0">
                            {tpl.categories.map((cat) => (
                              <span key={cat} className={cn("flex items-center gap-1 text-[11px] font-medium", CATEGORY_COLORS[cat] ?? "text-muted-foreground")}>
                                <span className={cn("h-1.5 w-1.5 rounded-full", CATEGORY_DOT_COLORS[cat] ?? "bg-muted-foreground")} />
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{tpl.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">{tpl.columns.length} columns</span>
                          <span className="flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Preview <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Preview header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{previewedTemplate.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{previewedTemplate.description}</p>
                  </div>
                  <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted" onClick={() => { if (!isCreating) setShowTemplateModal(false) }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Category tags + column count */}
                <div className="flex items-center gap-3 px-6 py-2.5 border-b border-border shrink-0">
                  {previewedTemplate.categories.map((cat) => (
                    <span key={cat} className={cn("flex items-center gap-1.5 text-xs font-medium", CATEGORY_COLORS[cat] ?? "text-muted-foreground")}>
                      <span className={cn("h-2 w-2 rounded-full", CATEGORY_DOT_COLORS[cat] ?? "bg-muted-foreground")} />
                      {cat}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground">· {previewedTemplate.columns.length} columns · {previewedTemplate.sampleRows.length} sample rows</span>
                </div>

                {/* Preview table */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/60 border-b border-border">
                            <th className="w-10 px-3 py-2.5 text-left text-muted-foreground font-medium border-r border-border">ID</th>
                            {previewedTemplate.columns.map((col) => (
                              <th key={col} className="px-3 py-2.5 text-left text-muted-foreground font-medium whitespace-nowrap border-r border-border last:border-r-0">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewedTemplate.sampleRows.map((row, i) => (
                            <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                              <td className="px-3 py-2.5 text-muted-foreground border-r border-border">{i + 1}</td>
                              {previewedTemplate.columns.map((col) => (
                                <td key={col} className="px-3 py-2.5 text-foreground whitespace-nowrap max-w-40 truncate border-r border-border last:border-r-0">
                                  {row[col] ?? ""}
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr className="bg-muted/10">
                            <td className="px-3 py-2.5 text-muted-foreground border-r border-border">{previewedTemplate.sampleRows.length + 1}</td>
                            <td className="px-3 py-2.5 text-muted-foreground/50 italic" colSpan={previewedTemplate.columns.length}>← ADD YOUR DATA HERE</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 border-t border-border shrink-0 flex items-center gap-2">
                  <Button onClick={() => createTableFromTemplate(previewedTemplate)} disabled={isCreating} className="gap-2">
                    {isCreating ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : <><ExternalLink className="h-4 w-4" />Use Template</>}
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewedTemplate(null)} disabled={isCreating}>
                    ← Back
                  </Button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ── AI Creator Modal ── */}
      {showCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Template Creator</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Describe what you need and AI will build the template.</p>
                </div>
              </div>
              <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted" onClick={() => { if (!isGenerating && !isCreating) setShowCreatorModal(false) }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Description input */}
              {!generatedTemplate && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-muted-foreground">What kind of table do you want to create?</label>
                  <textarea
                    rows={3}
                    value={creatorDescription}
                    onChange={(e) => setCreatorDescription(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleGenerate() }}
                    placeholder="e.g. track job applicants with their skills, resume links, interview stages and scores…"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                    disabled={isGenerating}
                  />
                  {generateError && <p className="text-xs text-destructive">{generateError}</p>}
                </div>
              )}

              {/* Generated preview */}
              {generatedTemplate && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-foreground">{generatedTemplate.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{generatedTemplate.description}</p>
                    </div>
                    <span className={cn("flex items-center gap-1 text-xs font-medium", CATEGORY_COLORS[generatedTemplate.category] ?? "text-muted-foreground")}>
                      <span className={cn("h-2 w-2 rounded-full", CATEGORY_DOT_COLORS[generatedTemplate.category] ?? "bg-muted-foreground")} />
                      {generatedTemplate.category}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="px-3 py-2 text-left text-muted-foreground font-medium w-8">#</th>
                            {generatedTemplate.columns.map((col) => (
                              <th key={col} className="px-3 py-2 text-left text-muted-foreground font-medium whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {generatedTemplate.sampleRows.map((row, i) => (
                            <tr key={i} className="border-b border-border last:border-0">
                              <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                              {generatedTemplate.columns.map((col) => (
                                <td key={col} className="px-3 py-2 text-foreground whitespace-nowrap max-w-40 truncate">{row[col] ?? ""}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{generatedTemplate.columns.length} columns · {generatedTemplate.sampleRows.length} sample rows</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border shrink-0 flex items-center gap-2">
              {!generatedTemplate ? (
                <>
                  <Button onClick={handleGenerate} disabled={isGenerating || !creatorDescription.trim()} className="gap-2">
                    {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating…</> : <><Wand2 className="h-4 w-4" />Generate Template</>}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowCreatorModal(false)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => createTableFromTemplate(generatedTemplate!)} disabled={isCreating} className="gap-2">
                    {isCreating ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : <><ExternalLink className="h-4 w-4" />Start Enriching</>}
                  </Button>
                  <Button variant="outline" onClick={() => { setGeneratedTemplate(null) }} disabled={isCreating}>Regenerate</Button>
                  <Button variant="ghost" onClick={() => setShowCreatorModal(false)} disabled={isCreating}>Cancel</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Import CSV Modal ── */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl animate-[gm-tilein_0.2s_ease_both] flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Import &amp; Enrich CSV</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Upload a file, name your table, and start enriching.</p>
              </div>
              <button
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => { setShowImportModal(false); setImportFile(null); setImportName("") }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleImportDrop}
                onClick={() => importFileRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 py-10 px-6 ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : importFile
                    ? "border-border bg-muted/30"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) parseAndSetFile(f); e.target.value = "" }}
                />
                {importFile ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-foreground" />
                    <p className="font-medium text-foreground text-sm">{importFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {importFile.headers.length} columns · {importFile.rows.length} rows — click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground text-sm">Drop your CSV or Excel file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse — .csv, .xlsx, .xls supported</p>
                  </>
                )}
              </div>

              {/* Preview table */}
              {importFile && (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="px-4 py-2 border-b border-border flex items-center gap-2 bg-muted/30">
                    <div className="h-2 w-2 rounded-full bg-foreground/40" />
                    <div className="h-2 w-2 rounded-full bg-foreground/25" />
                    <div className="h-2 w-2 rounded-full bg-foreground/15" />
                    <span className="ml-2 text-xs text-muted-foreground font-mono">{importFile.name} — preview</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          {importFile.headers.map((h, i) => (
                            <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0 whitespace-nowrap">
                              {h || `Col ${i + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importFile.rows.slice(0, 4).map((row, ri) => (
                          <tr key={ri} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                            {importFile.headers.map((_, ci) => (
                              <td key={ci} className="px-3 py-1.5 text-xs text-foreground border-r border-border/30 last:border-r-0 whitespace-nowrap max-w-40 truncate">
                                {row[ci] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importFile.rows.length > 4 && (
                    <div className="px-4 py-1.5 border-t border-border text-xs text-muted-foreground bg-muted/20">
                      Showing 4 of {importFile.rows.length} rows
                    </div>
                  )}
                </div>
              )}

              {/* Name input */}
              {importFile && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Table name</label>
                  <Input
                    placeholder="e.g. Lead outreach Q3"
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && importName.trim()) handleStartImport() }}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
              <p className="text-xs text-muted-foreground">
                {importFile ? `${importFile.headers.length} cols · ${importFile.rows.length} rows detected` : "No file selected"}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setShowImportModal(false); setImportFile(null); setImportName("") }}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!importFile || !importName.trim() || isImporting}
                  onClick={handleStartImport}
                  className="gap-1.5"
                >
                  {isImporting ? (
                    <><div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />Creating…</>
                  ) : (
                    <>Start Enrich →</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Table Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-2xl animate-[gm-tilein_0.2s_ease_both]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-foreground">New table</h3>
              <button
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => { setShowNameModal(false); setNewTableName("") }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Input
              type="text"
              placeholder="e.g. Lead outreach Q3"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newTableName.trim()) handleCreateTable() }}
              autoFocus
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowNameModal(false); setNewTableName("") }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateTable} disabled={!newTableName.trim() || isCreating}>
                {isCreating ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gm-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(10px, -14px) scale(1.05); }
          70%       { transform: translate(-7px, 7px) scale(0.97); }
        }
        @keyframes gm-shimmer {
          0%   { transform: translateX(-140%); }
          100% { transform: translateX(360%); }
        }
        @keyframes gm-gradshift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes gm-tilein {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </div>
  )
}