"use client"

import { useCallback, useRef, useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import {
  ArrowRight,
  Bot,
  Check,
  DatabaseZap,
  FileSpreadsheet,
  Globe2,
  MailCheck,
  MessageSquareText,
  Minus,
  Sparkles,
  UploadCloud,
} from "lucide-react"
import * as XLSX from "xlsx"

import { AppFooter } from "@/components/app-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"

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
  },
]

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For individuals exploring AI data enrichment.",
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
    features: [
      "5 spreadsheets",
      "500 AI credits / month",
      "CSV and Excel import",
      "Basic column enrichment",
      "Community support",
    ],
    missing: ["Web scraper agent", "Priority processing", "Team collaboration", "API access"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals who need power and speed.",
    cta: "Start Free Trial",
    href: "/register",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited spreadsheets",
      "10,000 AI credits / month",
      "All import formats",
      "All AI agents",
      "Web scraper agent",
      "Priority processing",
      "Email support",
    ],
    missing: ["Team collaboration", "API access"],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams that move fast with data at scale.",
    cta: "Contact Sales",
    href: "/register",
    highlighted: false,
    features: [
      "Unlimited everything",
      "Unlimited AI credits",
      "All Pro features",
      "Team collaboration",
      "REST API access",
      "SSO / SAML",
      "Dedicated support",
      "SLA guarantee",
    ],
    missing: [],
  },
]

const SAMPLE_ROWS = [
  ["Northstar Labs", "northstar.ai", "sarah@", "Verified"],
  ["Atlas Supply", "atlas.co", "ops@", "Enriching"],
  ["Cobalt Health", "cobalt.health", "sales@", "Queued"],
  ["Brightline CRM", "brightline.io", "founder@", "Verified"],
]

function parseFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
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

function AgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon

  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors duration-200 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium uppercase text-muted-foreground">
          {agent.badge}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold leading-snug text-foreground">{agent.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{agent.description}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {agent.capabilities.map((capability) => (
          <span
            key={capability}
            className="rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {capability}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importSectionRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)
  const updateColumnNames = useMutation(api.spreadsheets.updateColumnNamesBatch)

  const [csvData, setCsvData] = useState<ParsedCSV | null>(null)
  const [fileName, setFileName] = useState("")
  const [sheetName, setSheetName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file) return

    setFileName(file.name)
    setSheetName(file.name.replace(/\.(csv|xlsx|xls|txt)$/i, ""))

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
    importSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              G
            </div>
            <span className="font-semibold text-foreground">GridMind</span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            <button
              onClick={scrollToImport}
              className="min-h-11 rounded-md px-3 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Import
            </button>
            <a
              href="#agents"
              className="flex min-h-11 items-center rounded-md px-3 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Agents
            </a>
            <a
              href="#pricing"
              className="flex min-h-11 items-center rounded-md px-3 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px,transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI spreadsheet workspace for enrichment teams
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Turn messy spreadsheets into verified business intelligence.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Import a CSV or Excel file, run specialized AI agents, and enrich every row with scraped data, contact
              checks, summaries, and next-step automation.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-6 text-base" onClick={scrollToImport}>
                Import and enrich
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base" asChild>
                <Link href="/login">Open dashboard</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm">
              {[
                { value: "10K+", label: "Sheets created" },
                { value: "5", label: "AI agents" },
                { value: "<2s", label: "Avg enrich" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-card/70 p-4">
                  <p className="text-2xl font-semibold tabular-nums text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-border bg-card shadow-2xl shadow-primary/10">
              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-medium text-foreground">Lead enrichment.csv</span>
                </div>
                <span className="shrink-0 rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  Live agents
                </span>
              </div>

              <div className="grid grid-cols-[1fr_220px] overflow-hidden max-lg:grid-cols-1">
                <div className="overflow-x-auto">
                  <table className="min-w-[560px] text-sm">
                    <thead className="bg-muted/70 text-xs text-muted-foreground">
                      <tr>
                        {["Company", "Website", "Contact", "Status"].map((header) => (
                          <th key={header} className="border-r border-border px-4 py-3 text-left font-medium last:border-r-0">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_ROWS.map((row) => (
                        <tr key={row[0]} className="border-t border-border/70">
                          {row.map((cell, index) => (
                            <td key={`${row[0]}-${cell}`} className="border-r border-border/50 px-4 py-3 text-foreground last:border-r-0">
                              {index === 3 ? (
                                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
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

                <div className="border-l border-border bg-background/60 p-4 max-lg:border-l-0 max-lg:border-t">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Agent run</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { icon: Globe2, label: "Scraper found 18 sources" },
                      { icon: MailCheck, label: "Contacts verified" },
                      { icon: DatabaseZap, label: "Rows enriched" },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-5 rounded-lg bg-primary px-3 py-3 text-primary-foreground">
                    <p className="text-xs font-medium">Next action</p>
                    <p className="mt-1 text-sm">Generate personalized outreach for verified contacts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={importSectionRef} id="import" className="relative bg-secondary/20 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase text-primary">Quick Start</span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">From file to insights in seconds</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Drop your CSV or Excel file, name the sheet, and let GridMind agents prepare it for enrichment.
            </p>
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
            className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isDragging
                ? "scale-[1.01] border-primary bg-primary/10"
                : csvData
                  ? "border-border bg-muted/30"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.txt"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            {csvData ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Check className="h-6 w-6" />
                </div>
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {csvData.headers.length} columns, {csvData.rows.length} rows. Click to replace.
                </p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="font-medium text-foreground">Drop your CSV or Excel file here</p>
                <p className="text-sm text-muted-foreground">or click to browse. CSV, XLSX, XLS, and TXT are supported.</p>
              </>
            )}
          </div>

          {csvData && (
            <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <span className="ml-1 truncate text-xs text-muted-foreground">{fileName} preview</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {csvData.headers.map((header, index) => (
                        <th
                          key={`${header}-${index}`}
                          className="whitespace-nowrap border-r border-border px-4 py-2 text-left text-xs font-semibold text-muted-foreground last:border-r-0"
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
                            className="max-w-50 truncate whitespace-nowrap border-r border-border/30 px-4 py-2 text-foreground last:border-r-0"
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
                <div className="border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                  Showing 5 of {csvData.rows.length} rows
                </div>
              )}
            </div>
          )}

          {csvData && (
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Input
                className="h-11 flex-1 text-base"
                placeholder="Name your spreadsheet"
                value={sheetName}
                onChange={(event) => setSheetName(event.target.value)}
              />
              <Button
                size="lg"
                className="h-11 shrink-0 px-8 text-base shadow-lg shadow-primary/20"
                disabled={isCreating || !sheetName.trim()}
                onClick={handleStartEnrich}
              >
                {isCreating ? "Creating..." : "Start enrich"}
                {!isCreating && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="agents" className="relative overflow-hidden px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="text-xs font-semibold uppercase text-primary">AI Agents</span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Five agents. Every data workflow covered.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Each agent is purpose-built for a business data task. Chain them together or let the Orchestrator decide.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {AGENTS.slice(0, 3).map((agent) => (
              <AgentCard key={agent.title} agent={agent} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mx-auto md:max-w-2xl md:grid-cols-2">
            {AGENTS.slice(3).map((agent) => (
              <AgentCard key={agent.title} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative bg-secondary/20 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <span className="text-xs font-semibold uppercase text-primary">Pricing</span>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground">Start for free. Upgrade when your data workflows need more power.</p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-lg border p-7 transition-all duration-200 ${
                  plan.highlighted
                    ? "z-10 border-primary bg-primary/5 shadow-2xl shadow-primary/15 md:-translate-y-2"
                    : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <Button
                  className={`mb-6 w-full ${plan.highlighted ? "shadow-lg shadow-primary/25" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>

                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      {feature}
                    </li>
                  ))}
                  {plan.missing.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground/55">
                      <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.{" "}
            <Link href="/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Sign up now
            </Link>
          </p>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}
