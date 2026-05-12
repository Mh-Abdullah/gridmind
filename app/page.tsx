"use client"

import { useState, useRef, useCallback } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppFooter } from "@/components/app-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import * as XLSX from "xlsx"

// ─── Types ───────────────────────────────────────────────────────────────────
interface ParsedCSV {
  headers: string[]
  rows: string[][]
}

// ─── Agent definitions ───────────────────────────────────────────────────────
const AGENTS = [
  {
    badge: "Data Collection",
    title: "Web & Platform Scraper",
    description:
      "Pulls structured data from any website, LinkedIn profiles, or Google Maps listings. Define your target and extraction goal — the agent handles pagination, parsing, and deduplication automatically.",
    capabilities: ["Website scraping", "LinkedIn extraction", "Maps & local business data"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    badge: "Analysis",
    title: "Sheet Chat Assistant",
    description:
      "Ask questions about your spreadsheet in plain language. The assistant understands column context, relationships, and patterns — returning precise answers, summaries, or formula suggestions without you writing a single query.",
    capabilities: ["Natural language queries", "Pattern & anomaly detection", "Formula suggestions"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    badge: "Enrichment",
    title: "Column Enricher",
    description:
      "Automatically fills missing or incomplete column values using context from neighboring cells and external sources. Scales from a single column to an entire dataset in one run.",
    capabilities: ["Bulk cell completion", "Cross-column context", "External source lookup"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    badge: "Contact & Outreach",
    title: "Contact Intelligence Agent",
    description:
      "Verifies email addresses, phone numbers, and social handles directly from your sheet data. Also generates personalised outreach messages by combining a prompt template with row-level data — ready to send at scale.",
    capabilities: ["Contact verification", "Personalised message generation", "Row-aware templating"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
  },
  {
    badge: "Orchestration",
    title: "AI Orchestrator",
    description:
      "A general-purpose agent that reads your prompt and executes the right sequence of actions: editing cells, running enrichments, or triggering the Scraper or Contact agents when external data is needed. One instruction, end-to-end execution.",
    capabilities: ["Multi-step task execution", "Agent orchestration", "Sheet editing & automation"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
]

// ─── Pricing plans ───────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for individuals exploring AI data enrichment.",
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
    features: [
      "5 spreadsheets",
      "500 AI credits / month",
      "CSV & Excel import",
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
      "All 6 AI agents",
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
    description: "Built for teams that move fast with data at scale.",
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

// ─── CSV parsing (client-side) ────────────────────────────────────────────────
function parseFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
      reader.onload = (e) => {
        try {
          const text = (e.target?.result as string) || ""
          const lines = text.trim().split("\n")
          const headers = lines[0]?.split(",").map((h) => h.replace(/^"|"$/g, "").trim()) ?? []
          const rows = lines.slice(1).map((line) =>
            line.split(",").map((c) => c.replace(/^"|"$/g, "").trim())
          )
          resolve({ headers, rows })
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsText(file)
    } else {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const wb = XLSX.read(data, { type: "array" })
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
          resolve({ headers: allRows[0] ?? [], rows: allRows.slice(1) })
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  })
}

// ─── Agent card sub-component ─────────────────────────────────────────────────
interface Agent {
  badge: string
  title: string
  description: string
  capabilities: string[]
  icon: React.ReactNode
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all duration-200 hover:shadow-md">
      {/* Icon + badge row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground border border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-colors duration-200">
          {agent.icon}
        </div>
        <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground border border-border/60 rounded-md px-2 py-0.5 bg-muted/50">
          {agent.badge}
        </span>
      </div>

      {/* Text */}
      <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug">{agent.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{agent.description}</p>

      {/* Capability chips */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {agent.capabilities.map((c) => (
          <span key={c} className="text-[11px] text-muted-foreground bg-muted/60 border border-border/50 rounded-md px-2 py-0.5">
            {c}
          </span>
        ))}
      </div>

      {/* Bottom divider line that fills on hover */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-border overflow-hidden rounded-full">
        <div className="h-full w-0 group-hover:w-full bg-primary transition-all duration-500 ease-out" />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importSectionRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const createSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet)
  const batchUpdateCells = useMutation(api.spreadsheets.updateCellsBatch)
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata)

  const [csvData, setCsvData] = useState<ParsedCSV | null>(null)
  const [fileName, setFileName] = useState("")
  const [sheetName, setSheetName] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // ── File handling ──
  const handleFile = useCallback(async (file: File) => {
    if (!file) return
    setFileName(file.name)
    const baseName = file.name.replace(/\.(csv|xlsx|xls|txt)$/i, "")
    setSheetName(baseName)
    try {
      const parsed = await parseFile(file)
      setCsvData(parsed)
    } catch {
      alert("Could not parse file. Please use CSV or Excel format.")
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleStartEnrich = async () => {
    if (!csvData) return
    setIsCreating(true)

    const name = sheetName.trim() || "Untitled Sheet"

    if (user?.id) {
      // User is logged in — create the table directly
      try {
        const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        const spreadsheetId = await createSpreadsheet({ tableId, userId: user.id, name })

        // Build flat cell array: row 0 = headers, rows 1..n = data
        const cells: { cellKey: string; value: string }[] = []
        csvData.headers.forEach((h, ci) => { if (h.trim()) cells.push({ cellKey: `0-${ci}`, value: h }) })
        csvData.rows.forEach((row, ri) => {
          row.forEach((val, ci) => { if (val.trim()) cells.push({ cellKey: `${ri + 1}-${ci}`, value: val }) })
        })

        if (cells.length > 0) {
          await batchUpdateCells({ spreadsheetId, cells })
        }

        await updateMetadata({
          spreadsheetId,
          numRows: csvData.rows.length + 1,
          numCols: csvData.headers.length,
        })

        router.push(`/dashboard/tables/${tableId}`)
      } catch (err) {
        console.error("Failed to create table:", err)
        setIsCreating(false)
      }
    } else {
      // Not logged in — save for after auth
      localStorage.setItem("pendingImport", JSON.stringify({ csvData, sheetName: name }))
      router.push("/login?intent=import")
    }
  }

  const scrollToImport = () => {
    importSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // ── Render ──
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">G</div>
          <span className="font-semibold text-foreground">GridMind</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <button onClick={scrollToImport} className="hover:text-foreground transition-colors">Import</button>
          <a href="#agents" className="hover:text-foreground transition-colors">Agents</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex gap-3 items-center">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-28 overflow-hidden" style={{ minHeight: "92vh" }}>

        {/* ── Multi-layer background ── */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Top radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-15%,hsl(var(--primary)/0.13),transparent_60%)]" />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(var(--foreground) 1px,transparent 1px),linear-gradient(90deg,var(--foreground) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          {/* Floating orbs */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-225 h-150 rounded-full bg-primary/10 blur-[140px] animate-[gm-orb_8s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -left-20 w-100 h-100 rounded-full bg-violet-500/8 blur-[100px] animate-[gm-orb_11s_ease-in-out_infinite_2s]" />
          <div className="absolute top-1/4 -right-20 w-87.5 h-87.5 rounded-full bg-accent/8 blur-[100px] animate-[gm-orb_9s_ease-in-out_infinite_4s]" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-background to-transparent" />
        </div>

        {/* ── Floating live-status chips (decorative) ── */}
        <div className="absolute top-36 left-6 lg:left-16 hidden lg:flex flex-col gap-3 items-start">
          <div className="animate-[gm-chipin_0.5s_ease_0.9s_both] flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-2 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs text-muted-foreground">42 emails verified</span>
          </div>
          <div className="animate-[gm-chipin_0.5s_ease_1.1s_both] flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-2 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
            <span className="text-xs font-mono text-primary">+1,240 rows enriched</span>
          </div>
        </div>
        <div className="absolute top-40 right-6 lg:right-16 hidden lg:flex flex-col gap-3 items-end">
          <div className="animate-[gm-chipin_0.5s_ease_1.0s_both] flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-2 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-muted-foreground">Scraping LinkedIn…</span>
          </div>
          <div className="animate-[gm-chipin_0.5s_ease_1.2s_both] flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-2 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-xs text-muted-foreground">3 agents running</span>
          </div>
        </div>

        {/* ── Badge ── */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary animate-[gm-fadein_0.6s_ease_both]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          AI-Powered Data Enrichment Platform
        </div>

        {/* ── Headline ── */}
        <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.06] animate-[gm-fadein_0.7s_ease_0.1s_both]">
          Turn Raw Data Into{" "}
          <br className="hidden md:block" />
          <span className="relative inline-block">
            <span
              className="bg-linear-to-r from-primary via-violet-500 to-accent bg-clip-text text-transparent animate-[gm-gradshift_5s_ease_infinite]"
              style={{ backgroundSize: "200% auto" }}
            >
              Intelligence
            </span>
            {/* Shimmer underline */}
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-primary/0 via-primary/50 to-primary/0 animate-[gm-shimmer_3s_ease-in-out_infinite]" />
          </span>
        </h1>

        {/* ── Subtext ── */}
        <p className="mt-7 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed animate-[gm-fadein_0.7s_ease_0.2s_both]">
          GridMind combines the simplicity of spreadsheets with the power of AI agents. Import your data, let agents
          scrape, enrich, and analyse — all without writing a line of code.
        </p>

        {/* ── CTAs ── */}
        <div className="mt-11 flex flex-col sm:flex-row gap-4 items-center justify-center animate-[gm-fadein_0.7s_ease_0.3s_both]">
          {/* Primary */}
          <button
            onClick={scrollToImport}
            className="group relative h-12 px-8 rounded-xl bg-primary text-primary-foreground text-base font-semibold overflow-hidden
              shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.45)]
              hover:shadow-[0_8px_36px_-4px_hsl(var(--primary)/0.55)]
              hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
              transition-all duration-200"
          >
            <span className="relative z-10">Import &amp; Enrich Free →</span>
            {/* Sweep shine on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-linear-to-r from-transparent via-white/12 to-transparent" />
          </button>
          {/* Secondary */}
          <Link
            href="/login"
            className="group h-12 px-8 rounded-xl border border-border bg-card text-foreground text-base font-semibold
              hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5
              active:translate-y-0 active:scale-[0.98]
              transition-all duration-200 flex items-center gap-2"
          >
            Open Dashboard
            <svg
              className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* ── Stats bar ── */}
        <div className="mt-20 flex flex-wrap justify-center gap-px rounded-2xl border border-border overflow-hidden bg-border animate-[gm-fadein_0.7s_ease_0.45s_both]">
          {[
            { value: "10K+", label: "Spreadsheets Created" },
            { value: "6",    label: "AI Agents" },
            { value: "99.9%", label: "Uptime" },
            { value: "<2s",  label: "Avg Enrich Time" },
          ].map((s) => (
            <div
              key={s.label}
              className="group flex flex-col items-center justify-center px-10 py-6 bg-background hover:bg-muted/40 transition-colors duration-150 min-w-36"
            >
              <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CSV Import ── */}
      <section ref={importSectionRef} id="import" className="relative px-6 py-24 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Quick Start</span>
            <h2 className="mt-2 text-4xl font-bold">From file to insights in seconds</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Drop your CSV or Excel file, give your spreadsheet a name, and let GridMind agents do the heavy lifting.
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
              flex flex-col items-center justify-center gap-3 py-12 px-6
              ${isDragging
                ? "border-primary bg-primary/10 scale-[1.01]"
                : csvData
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.txt"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            {csvData ? (
              <>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">✅</div>
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  {csvData.headers.length} columns · {csvData.rows.length} rows — click to replace
                </p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">📂</div>
                <p className="font-medium text-foreground">Drop your CSV or Excel file here</p>
                <p className="text-sm text-muted-foreground">or click to browse — .csv, .xlsx, .xls supported</p>
              </>
            )}
          </div>

          {/* Preview table */}
          {csvData && (
            <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">{fileName} — preview</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {csvData.headers.map((h, i) => (
                        <th key={i} className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0 whitespace-nowrap">
                          {h || `Column ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.rows.slice(0, 5).map((row, ri) => (
                      <tr key={ri} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                        {csvData.headers.map((_, ci) => (
                          <td key={ci} className="px-4 py-2 text-foreground border-r border-border/30 last:border-r-0 whitespace-nowrap max-w-50 truncate">
                            {row[ci] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {csvData.rows.length > 5 && (
                <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground bg-muted/20">
                  Showing 5 of {csvData.rows.length} rows
                </div>
              )}
            </div>
          )}

          {/* Name + CTA */}
          {csvData && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Input
                className="flex-1 h-11 text-base"
                placeholder="Name your spreadsheet…"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
              />
              <Button
                size="lg"
                className="h-11 px-8 text-base shadow-lg shadow-primary/20 shrink-0"
                disabled={isCreating || !sheetName.trim()}
                onClick={handleStartEnrich}
              >
                {isCreating ? "Creating…" : "Start Enrich →"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Agents ── */}
      <section id="agents" className="relative px-6 py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">AI Agents</span>
            <h2 className="mt-2 text-4xl font-bold">Five agents. Every data workflow covered.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Each agent is purpose-built for a specific business task. Chain them together or let the Orchestrator decide.
            </p>
          </div>

          {/* Top row: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {AGENTS.slice(0, 3).map((agent) => (
              <AgentCard key={agent.title} agent={agent} />
            ))}
          </div>
          {/* Bottom row: 2 cards centred */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-2xl md:mx-auto">
            {AGENTS.slice(3).map((agent) => (
              <AgentCard key={agent.title} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative px-6 py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">Pricing</span>
            <h2 className="mt-2 text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground">Start for free. Upgrade when you need more power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative flex flex-col rounded-2xl border p-7 transition-all duration-300
                  ${plan.highlighted
                    ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20 scale-[1.03] z-10"
                    : "border-border bg-card hover:border-primary/40 hover:shadow-lg"
                  }
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-primary/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <Button
                  className={`w-full mb-6 ${plan.highlighted ? "shadow-lg shadow-primary/30" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground/50">
                      <span className="mt-0.5 shrink-0">–</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.{" "}
            <Link href="/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Sign up now →
            </Link>
          </p>
        </div>
      </section>

      <AppFooter />

      {/* ── Global animation styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gm-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(14px, -18px) scale(1.06); }
          70%       { transform: translate(-10px, 10px) scale(0.96); }
        }
        @keyframes gm-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gm-chipin {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes gm-gradshift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes gm-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      ` }} />
    </div>
  )
}
