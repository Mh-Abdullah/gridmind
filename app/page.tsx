"use client"

import { useCallback, useRef, useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import {
  ArrowRight,
  Bot,
  Check,
  DatabaseZap,
  FileSpreadsheet,
  Globe2,
  MailCheck,
  Menu,
  MessageSquareText,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react"
import * as XLSX from "xlsx"

import { AppFooter } from "@/components/app-footer"
import { BrandIcon, BrandLogo } from "@/components/brand-assets"
import { LandingWorkflowSection } from "@/components/landing-workflow-section"
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack"
import { formatPackagePeriod, parsePackageDescription } from "@/lib/package-period"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface ParsedCSV {
  headers: string[]
  rows: string[][]
}

interface Agent {
  badge: string
  title: string
  description: string
  capabilities: string[]
  icon: React.ComponentType<{ className?: string }>
  featured?: boolean
}

const AGENTS: Agent[] = [
  {
    badge: "Data Collection",
    title: "Web & Platform Scraper",
    description:
      "Pull structured data from websites, LinkedIn profiles, and Google Maps listings with automatic parsing, pagination, and deduplication.",
    capabilities: ["Website scraping", "LinkedIn extraction", "Maps data"],
    icon: Globe2,
  },
  {
    badge: "Analysis",
    title: "Sheet Chat Assistant",
    description:
      "Ask natural-language questions about spreadsheet context, relationships, patterns, anomalies, and formula options.",
    capabilities: ["Natural-language queries", "Pattern detection", "Formula help"],
    icon: MessageSquareText,
  },
  {
    badge: "Enrichment",
    title: "Column Enricher",
    description:
      "Fill missing values using neighboring cells, row context, and external sources across a single column or full dataset.",
    capabilities: ["Bulk completion", "Cross-column context", "Source lookup"],
    icon: DatabaseZap,
  },
  {
    badge: "Contact & Outreach",
    title: "Contact Intelligence Agent",
    description:
      "Verify email addresses, phone numbers, and social profiles, then generate row-aware outreach for every qualified lead.",
    capabilities: ["Contact verification", "Message generation", "Row templates"],
    icon: MailCheck,
  },
  {
    badge: "Orchestration",
    title: "AI Orchestrator",
    description:
      "Read one instruction and choose the right sequence of sheet edits, enrichments, scraping tasks, and follow-up actions.",
    capabilities: ["Multi-step execution", "Agent routing", "Sheet automation"],
    icon: Bot,
    featured: true,
  },
]

const SAMPLE_ROWS = [
  ["Northstar Labs", "northstar.ai", "sarah@", "Verified"],
  ["Atlas Supply", "atlas.co", "ops@", "Enriching"],
  ["Cobalt Health", "cobalt.health", "sales@", "Queued"],
  ["Brightline CRM", "brightline.io", "founder@", "Verified"],
]

const RIBBON_ITEMS = [
  "CSV & Excel",
  "LinkedIn profiles",
  "Google Maps",
  "Bulk enrichment",
  "Credit-based billing",
  "Website scraping",
  "AI-powered enrichment",
  "Lead intelligence",
]

const NAV_LINKS = [
  { label: "Import", href: "#import", onClick: true },
  { label: "How it works", href: "#workflow" },
  { label: "Agents", href: "#agents" },
  { label: "Pricing", href: "#pricing" },
]

function parseFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    if (file.name.endsWith(".csv")) {
      reader.onload = (event) => {
        try {
          const text = (event.target?.result as string) || ""
          const lines = text.trim().split("\n")
          const headers = lines[0]?.split(",").map((h) => h.replace(/^"|"$/g, "").trim()) ?? []
          const rows = lines.slice(1).map((line) =>
            line.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim())
          )
          resolve({ headers, rows })
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsText(file)
      return
    }

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const range = XLSX.utils.decode_range(sheet["!ref"] || "A1")
        const allRows: string[][] = []

        for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
          const row: string[] = []
          for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
            const address = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
            row.push(sheet[address] ? String(sheet[address].v ?? "") : "")
          }
          allRows.push(row)
        }

        resolve({ headers: allRows[0] ?? [], rows: allRows.slice(1) })
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: {
  label: string
  title: string
  description: string
  align?: "center" | "left"
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
    </div>
  )
}

function AgentMiniVisual({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <div className="agent-mini-visual">
        <div className="agent-mini-browser">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-foreground/25" />
              <span className="h-2 w-2 rounded-full bg-foreground/15" />
              <span className="h-2 w-2 rounded-full bg-foreground/10" />
            </div>
            <span className="h-2 w-16 rounded-full bg-foreground/10" />
          </div>
          {[0, 1, 2].map((row) => (
            <div key={row} className={cn("agent-mini-row", `agent-mini-delay-${row + 1}`)}>
              <span className="h-2 w-8 rounded-full bg-foreground/15" />
              <span className="h-2 flex-1 rounded-full bg-foreground/10" />
              <span className="h-2 w-10 rounded-full bg-foreground/20" />
            </div>
          ))}
          <div className="agent-mini-scan-line" />
        </div>
      </div>
    )
  }

  if (variant === 1) {
    return (
      <div className="agent-mini-visual">
        <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-3">
          <div className="space-y-2">
            {["Ask", "Find pattern", "Answer"].map((label, index) => (
              <div key={label} className={cn("agent-mini-bubble", `agent-mini-delay-${index + 1}`)}>
                {label}
              </div>
            ))}
          </div>
          <div className="agent-mini-chart">
            <svg viewBox="0 0 160 90" className="h-full w-full" aria-hidden="true">
              <path d="M10 72 C35 54, 46 66, 68 42 S112 28, 150 14" className="agent-mini-chart-line" />
              {[10, 68, 150].map((x, index) => (
                <circle key={x} cx={x} cy={[72, 42, 14][index]} r="4" className="agent-mini-chart-dot" />
              ))}
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 2) {
    return (
      <div className="agent-mini-visual">
        <div className="agent-mini-table">
          {["Company", "Industry", "Score"].map((header) => (
            <span key={header} className="agent-mini-th">
              {header}
            </span>
          ))}
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className={cn("agent-mini-cell", index % 3 === 2 && "agent-mini-cell-fill")} />
          ))}
        </div>
        <div className="agent-mini-progress">
          <span />
        </div>
      </div>
    )
  }

  if (variant === 3) {
    return (
      <div className="agent-mini-visual">
        <div className="space-y-2.5">
          {["Email verified", "Phone matched", "Draft ready"].map((label, index) => (
            <div key={label} className={cn("agent-mini-check-row", `agent-mini-delay-${index + 1}`)}>
              <span>{label}</span>
              <Check className="h-3.5 w-3.5" />
            </div>
          ))}
        </div>
        <div className="agent-mini-radar">
          <span />
          <span />
        </div>
      </div>
    )
  }

  return (
    <div className="agent-mini-visual">
      <div className="agent-mini-pipeline">
        {["Scrape", "Clean", "Enrich", "Route"].map((label, index) => (
          <div key={label} className="agent-mini-node">
            <Sparkles className={cn("h-3.5 w-3.5", index === 3 && "agent-mini-spin")} />
            <span>{label}</span>
          </div>
        ))}
        <div className="agent-mini-pipeline-line" />
        <div className="agent-mini-pipeline-dot" />
      </div>
    </div>
  )
}

function AgentStackContent({ agent, index }: { agent: Agent; index: number }) {
  const Icon = agent.icon

  return (
    <div className="agent-scroll-card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-card p-6 md:p-9">
      <div className="agent-mini-orb agent-mini-orb-left" />
      <div className="agent-mini-orb agent-mini-orb-right" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      <div className="relative mb-6 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/60 text-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {agent.badge}
        </span>
      </div>
      <div className="relative grid flex-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] md:items-end">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-[2rem]">{agent.title}</h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-lg">{agent.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 max-md:hidden">
            {agent.capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>
        <AgentMiniVisual variant={index} />
      </div>
    </div>
  )
}

function HeroPreview() {
  return (
    <div className="landing-float relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-foreground/[0.04] blur-2xl" />
      <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/95 shadow-[0_32px_80px_-40px_color-mix(in_oklab,var(--foreground)_35%,transparent)] backdrop-blur">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 bg-muted/30 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background">
              <FileSpreadsheet className="h-4 w-4 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Lead enrichment.csv</p>
              <p className="text-xs text-muted-foreground">4 rows · 4 agents active</p>
            </div>
          </div>
          <span className="landing-pulse-ring shrink-0 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
            Live
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="overflow-x-auto">
            <table className="min-w-[520px] text-sm">
              <thead className="bg-muted/50 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  {["Company", "Website", "Contact", "Status"].map((header) => (
                    <th
                      key={header}
                      className="border-r border-border/70 px-4 py-3 text-left font-medium last:border-r-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map((row) => (
                  <tr key={row[0]} className="border-t border-border/70 bg-background/80">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className="border-r border-border/50 px-4 py-3 text-foreground last:border-r-0"
                      >
                        {index === 3 ? (
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-medium",
                              cell === "Enriching"
                                ? "bg-foreground/10 text-foreground"
                                : cell === "Verified"
                                  ? "bg-foreground text-background"
                                  : "border border-border bg-muted/50 text-muted-foreground"
                            )}
                          >
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border/70 bg-muted/20 p-4 lg:border-l lg:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Agent run</p>
            <div className="mt-4 space-y-3">
              {[
                { icon: Globe2, label: "Scraper found 18 sources" },
                { icon: BrandIcon, label: "AI agent reviewed rows" },
                { icon: DatabaseZap, label: "Rows enriched" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-3 py-3"
                  >
                    <Icon className="h-4 w-4 text-foreground" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 rounded-xl bg-foreground px-4 py-4 text-background shadow-lg">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/60">Next action</p>
              <p className="mt-2 text-sm leading-relaxed">Generate personalized outreach for verified contacts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroRibbon() {
  const items = [...RIBBON_ITEMS, ...RIBBON_ITEMS]

  return (
    <div className="landing-ribbon-wrap border-t border-border/60 bg-muted/20">
      <div className="landing-ribbon-mask">
        <div className="landing-ribbon-track" aria-hidden="true">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="landing-ribbon-item">
              <span className="landing-ribbon-text">{item}</span>
              <span className="landing-ribbon-dot" />
            </div>
          ))}
        </div>

        <div className="sr-only" aria-label="Platform capabilities">
          {RIBBON_ITEMS.join(", ")}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importSectionRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const publicPackages = useQuery(api.billing.getPublicPackages, {}) ?? []
  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)

  const [csvData, setCsvData] = useState<ParsedCSV | null>(null)
  const [fileName, setFileName] = useState("")
  const [sheetName, setSheetName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file) return

    setFileName(file.name)
    setSheetName(file.name.replace(/\.(csv|xlsx|xls)$/i, ""))

    try {
      setCsvData(await parseFile(file))
    } catch {
      alert("Could not parse file. Please use CSV or Excel format.")
    }
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)

      const file = event.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleStartEnrich = async () => {
    if (!csvData) return

    setIsCreating(true)
    const name = sheetName.trim() || "Untitled Sheet"

    if (!user?.id) {
      localStorage.setItem("pendingImport", JSON.stringify({ csvData, sheetName: name }))
      router.push("/login?intent=import")
      return
    }

    try {
      const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name })
      const cells: { cellKey: string; value: string }[] = []

      csvData.rows.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value.trim()) cells.push({ cellKey: `${rowIndex}-${colIndex}`, value })
        })
      })

      const names = csvData.headers
        .map((header, colIndex) => ({ colIndex, name: header.trim() }))
        .filter((column) => column.name !== "")

      if (names.length > 0) await updateColumnNames({ spreadsheetId, names })
      if (cells.length > 0) await batchUpdateCells({ spreadsheetId, cells })

      await updateMetadata({
        spreadsheetId,
        numRows: csvData.rows.length,
        numCols: csvData.headers.length,
      })

      router.push(`/dashboard/tables/${tableId}`)
    } catch (err) {
      console.error("Failed to create table:", err)
      setIsCreating(false)
    }
  }

  const scrollToImport = () => {
    setMobileNavOpen(false)
    importSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing-page flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandLogo className="h-8" priority />
          </Link>

          <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            {NAV_LINKS.map((link) =>
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={scrollToImport}
                  className="min-h-11 rounded-full px-4 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex min-h-11 items-center rounded-full px-4 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="landing-amber-sweep hidden sm:inline-flex" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" className="landing-amber-sweep" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="md:hidden"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-border/60 bg-background/95 px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) =>
                link.onClick ? (
                  <button
                    key={link.label}
                    onClick={scrollToImport}
                    className="rounded-xl px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                )
              )}
              <Link
                href="/login"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-border/70">
          <div className="landing-hero-glow absolute inset-0 -z-10" />
          <div className="landing-grid-bg absolute inset-0 -z-10 opacity-[0.35]" />

          <div className="mx-auto flex min-h-[calc(100dvh-4rem-76px)] max-w-7xl items-center px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
            <div className="grid min-h-[min(760px,calc(100dvh-11rem))] w-full items-center gap-12 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] xl:gap-24">
              <div className="max-w-2xl px-2 py-4 sm:px-4 lg:px-8">
                <div className="landing-fade-up landing-amber-badge mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  AI spreadsheet workspace for enrichment teams
                </div>

                <h1 className="landing-fade-up landing-fade-up-delay-1 max-w-none text-[1.7rem] font-semibold leading-[1.06] tracking-[-0.038em] text-foreground sm:text-[2.1rem] lg:text-[2.75rem]">
                  <span className="block whitespace-nowrap">
                    Turn messy{" "}
                    <span className="landing-amber-word font-serif italic font-semibold tracking-[-0.03em]">
                      spreadsheets
                    </span>{" "}
                    into
                  </span>
                  <span className="block whitespace-nowrap">verified business intelligence.</span>
                </h1>

                <p className="landing-fade-up landing-fade-up-delay-2 mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                  Enrich leads without leaving your sheet.
                </p>

                <div className="landing-fade-up landing-fade-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="landing-amber-sweep h-12 rounded-full px-7 text-base shadow-lg shadow-foreground/10" onClick={scrollToImport}>
                    Import and enrich
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="landing-amber-sweep h-12 rounded-full px-7 text-base" asChild>
                    <Link href={user?.id ? "/dashboard/tables" : "/register"}>
                      {user?.id ? "Open dashboard" : "Create free account"}
                    </Link>
                  </Button>
                </div>

                <div className="landing-fade-up landing-fade-up-delay-3 mt-10 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "10K+", label: "Sheets created" },
                    { value: "5", label: "AI agents" },
                    { value: "<2s", label: "Avg enrich" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="landing-stat-card rounded-[1.35rem] border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur"
                    >
                      <p className="text-2xl font-semibold tabular-nums tracking-[-0.03em] text-foreground">{stat.value}</p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative px-2 py-4 sm:px-4 lg:px-6">
                <HeroPreview />
              </div>
            </div>
          </div>

          <HeroRibbon />
        </section>

        <section ref={importSectionRef} id="import" className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-28">
          <div className="quickstart-orb quickstart-orb-left absolute inset-x-0 top-16 -z-10 mx-auto h-72 max-w-6xl rounded-full bg-foreground/[0.04] blur-3xl" />
          <div className="quickstart-orb quickstart-orb-right absolute right-8 bottom-20 -z-10 h-48 w-48 rounded-full bg-foreground/[0.05] blur-3xl" />
          <div className="mx-auto max-w-[86rem]">
            <div className="quickstart-shell-reveal rounded-[2rem] border border-border/70 bg-card/65 p-5 shadow-[0_40px_120px_-60px_color-mix(in_oklab,var(--foreground)_18%,transparent)] backdrop-blur sm:p-8 lg:p-10">
              <div className="space-y-8">
                <div className="mx-auto flex max-w-6xl flex-col justify-between">
                  <div>
                    <div className="landing-fade-up">
                      <SectionHeading
                        label="Quick start"
                        title="From file to insights in seconds"
                        description="Import your sheet, preview the structure, and launch enrichment without leaving the workspace."
                        align="center"
                      />
                    </div>

                    <div className="mt-8 grid gap-3 md:grid-cols-3">
                      {[
                        {
                          step: "01",
                          title: "Drop a CSV or Excel file",
                          text: "Bring raw lead lists, exports, and internal spreadsheets into GridMind in one step.",
                        },
                        {
                          step: "02",
                          title: "Preview the structure",
                          text: "Check headers and rows before enrichment starts so your table stays clean.",
                        },
                        {
                          step: "03",
                          title: "Launch AI enrichment",
                          text: "Name the sheet and let the agents prepare contacts, context, and next actions.",
                        },
                      ].map((item) => (
                        <div
                          key={item.step}
                          className={cn(
                            "quickstart-step-card quickstart-step-reveal rounded-[1.4rem] border border-border/70 bg-background/80 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1",
                            item.step === "01" && "quickstart-step-delay-1",
                            item.step === "02" && "quickstart-step-delay-2",
                            item.step === "03" && "quickstart-step-delay-3"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/50 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
                              {item.step}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{item.title}</p>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="landing-fade-up landing-fade-up-delay-2 mt-8 flex flex-wrap justify-center gap-3">
                    {[
                      { value: "CSV, XLSX, XLS", label: "Supported formats" },
                      { value: "5-row instant preview", label: "Before import" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="quickstart-format-pill rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground"
                      >
                        <span className="font-medium text-foreground">{item.value}</span> · {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="quickstart-workspace-reveal rounded-[1.8rem] border border-border/70 bg-background/85 p-2.5 shadow-[0_32px_90px_-54px_color-mix(in_oklab,var(--foreground)_20%,transparent)] sm:p-3">
                  <div className="quickstart-workspace-header mb-2 flex items-center justify-between gap-4 rounded-[1.25rem] border border-border/70 bg-muted/30 px-4 py-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                        <FileSpreadsheet className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Import workspace</p>
                        <p className="truncate text-xs text-muted-foreground">Upload, inspect, and enrich in one flow</p>
                      </div>
                    </div>
                    <span className="quickstart-ready-pill rounded-full border border-border/70 bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Ready
                    </span>
                  </div>

                  <div
                    onDragOver={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click()
                    }}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "quickstart-dropzone relative overflow-hidden rounded-[1.6rem] border-2 border-dashed px-6 py-4 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isDragging
                        ? "scale-[1.01] border-foreground bg-foreground/[0.04] shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--foreground)_20%,transparent)]"
                        : csvData
                          ? "border-border bg-muted/20"
                          : "border-border/80 bg-card/50 hover:border-foreground/25 hover:bg-muted/30"
                    )}
                  >
                    <div className="absolute inset-x-10 top-0 h-24 bg-gradient-to-b from-foreground/[0.05] to-transparent blur-2xl" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) handleFile(file)
                      }}
                    />
                    {csvData ? (
                      <div className="relative flex flex-col items-center gap-2">
                        <div className="quickstart-icon-pop flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background shadow-lg shadow-foreground/15">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold tracking-[-0.02em] text-foreground">{fileName}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {csvData.headers.length} columns, {csvData.rows.length} rows. Click to replace.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center gap-2">
                        <div className="quickstart-icon-pop flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground shadow-lg shadow-foreground/5">
                          <UploadCloud className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
                            Drop your CSV or Excel file here
                          </p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            Click to browse or drag and drop. CSV, XLSX, and XLS are supported.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {csvData && (
                    <div className="quickstart-preview-reveal mt-5 overflow-hidden rounded-[1.35rem] border border-border/80 bg-card shadow-sm">
                      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-foreground" />
                          <span className="truncate text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            {fileName} preview
                          </span>
                        </div>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          First 5 rows
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-muted/40">
                            <tr>
                              {csvData.headers.map((header, index) => (
                                <th
                                  key={`${header}-${index}`}
                                  className="whitespace-nowrap border-r border-border px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground last:border-r-0"
                                >
                                  {header || `Column ${index + 1}`}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t border-border/50 transition-colors hover:bg-muted/20">
                                {csvData.headers.map((_, colIndex) => (
                                  <td
                                    key={`${rowIndex}-${colIndex}`}
                                    className="max-w-50 truncate whitespace-nowrap border-r border-border/30 px-4 py-2.5 text-foreground last:border-r-0"
                                  >
                                    {row[colIndex] ?? ""}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {csvData.rows.length > 5 && (
                        <div className="border-t border-border bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
                          Showing 5 of {csvData.rows.length} rows
                        </div>
                      )}
                    </div>
                  )}

                  {csvData && (
                    <div className="landing-fade-up landing-fade-up-delay-3 mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Input
                        className="h-12 flex-1 rounded-xl border-border/80 bg-background text-base"
                        placeholder="Name your spreadsheet"
                        value={sheetName}
                        onChange={(event) => setSheetName(event.target.value)}
                      />
                      <Button
                        size="lg"
                        className="landing-amber-sweep h-12 shrink-0 rounded-xl px-8 text-base shadow-lg shadow-foreground/10"
                        disabled={isCreating || !sheetName.trim()}
                        onClick={handleStartEnrich}
                      >
                        {isCreating ? "Creating..." : "Start enrich"}
                        {!isCreating && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingWorkflowSection />

        <section id="agents" className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-28">
          <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              label="AI agents"
              title="Five agents. Every data workflow covered."
              description="Each agent is purpose-built for a business data task. Chain them together or let the Orchestrator decide."
            />

            <div className="mt-14 h-[28rem] overflow-hidden max-md:h-[21rem]">
              <ScrollStack
                className="agents-scroll-stack"
                itemDistance={46}
                itemStackDistance={18}
                stackPosition="18"
                scaleEndPosition="10"
                baseScale={0.92}
                itemScale={0.018}
                blurAmount={0}
              >
                {AGENTS.map((agent, index) => (
                  <ScrollStackItem key={agent.title} itemClassName="agent-scroll-stack-item">
                    <AgentStackContent agent={agent} index={index} />
                  </ScrollStackItem>
                ))}
              </ScrollStack>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-border/70 bg-muted/15 px-4 py-20 sm:px-6 md:py-28">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              label="Pricing"
              title="Simple, transparent pricing"
              description="Start for free. Upgrade when your data workflows need more power."
            />

            <div className="mt-14 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
              {publicPackages.map((plan) => {
                const parsed = parsePackageDescription(plan.description)
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col rounded-[1.5rem] border p-7 transition-all duration-300",
                      plan.isFeatured
                        ? "z-10 border-foreground/20 bg-background shadow-[0_28px_70px_-36px_color-mix(in_oklab,var(--foreground)_30%,transparent)] md:-translate-y-2"
                        : "border-border/80 bg-background/80 hover:border-foreground/15 hover:shadow-lg"
                    )}
                  >
                    {plan.isFeatured && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-background">
                          Featured
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
                          ${(plan.salePriceCents / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">one-time</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {parsed.description || "Credits package created by your admin team."}
                      </p>
                    </div>

                    <Button
                      className={cn("landing-amber-sweep mb-6 h-11 w-full rounded-xl", plan.isFeatured && "shadow-lg shadow-foreground/10")}
                      variant={plan.isFeatured ? "default" : "outline"}
                      asChild
                    >
                      <Link href={user?.id && plan.polarProductId ? `/api/billing/checkout?packageId=${plan.id}` : "/register"}>
                        {user?.id && plan.polarProductId ? "Buy credits" : "Get started"}
                      </Link>
                    </Button>

                    <ul className="flex-1 space-y-3">
                      <li className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                        {plan.credits.toLocaleString()} credits included
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                        Valid for {formatPackagePeriod(parsed.periodMonths).toLowerCase()}
                      </li>
                      <li className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                        {plan.polarProductId ? "Polar checkout connected" : "Awaiting Polar product link"}
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>

            {publicPackages.length === 0 && (
              <div className="mt-14 rounded-[1.5rem] border border-dashed border-border bg-background/70 p-10 text-center text-sm text-muted-foreground">
                No live packages yet. An admin can create them from the billing dashboard.
              </div>
            )}

            <p className="mt-10 text-center text-sm text-muted-foreground">
              Packages are loaded from the admin billing dashboard, so pricing and credits stay dynamic.{" "}
              <Link href="/register" className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80">
                Create an account
              </Link>
            </p>
          </div>
        </section>

      </main>

      <AppFooter />
    </div>
  )
}
