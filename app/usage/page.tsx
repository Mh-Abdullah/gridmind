"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import {
  Activity,
  BarChart3,
  Clock3,
  CreditCard,
  Loader2,
  Menu,
  TrendingUp,
  WalletCards,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

function formatCredits(value: number) {
  return value.toLocaleString()
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })
}

function buildLinePath(values: number[], width: number, height: number) {
  if (values.length === 0) return ""
  if (values.length === 1) return `M 0 ${height / 2} L ${width} ${height / 2}`

  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")
}

function buildAreaPath(values: number[], width: number, height: number) {
  if (values.length === 0) return ""

  const line = buildLinePath(values, width, height)
  return `${line} L ${width} ${height} L 0 ${height} Z`
}

function SummaryCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string
  value: string
  helper: string
  icon: typeof WalletCards
}) {
  return (
    <article className="rounded-[26px] border border-border/70 bg-card/92 p-5 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
    </article>
  )
}

function HorizontalBarChart({
  rows,
  empty,
  colorClass = "bg-foreground",
}: {
  rows: Array<{ label: string; sublabel?: string; value: number; footer?: string }>
  empty: string
  colorClass?: string
}) {
  if (rows.length === 0) {
    return <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">{empty}</div>
  }

  const max = Math.max(...rows.map((row) => row.value), 1)

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <article key={`${row.label}-${row.sublabel ?? ""}`} className="rounded-[22px] border border-border/65 bg-background/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{row.label}</p>
              {row.sublabel ? <p className="mt-1 text-xs text-muted-foreground">{row.sublabel}</p> : null}
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold tracking-[-0.03em] text-foreground">{formatCredits(row.value)}</p>
              {row.footer ? <p className="text-xs text-muted-foreground">{row.footer}</p> : null}
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted/60">
            <div className={cn("h-full rounded-full", colorClass)} style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
        </article>
      ))}
    </div>
  )
}

function ChartShell({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow: string
  title: string
  icon: typeof BarChart3
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Array<{ label: string; value: number; color: string; chip: string }>
  centerLabel: string
  centerValue: string
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  let angleCursor = 0

  const gradient = segments
    .map((segment) => {
      const start = angleCursor
      const sweep = total > 0 ? (segment.value / total) * 360 : 0
      angleCursor += sweep
      return `${segment.color} ${start}deg ${angleCursor}deg`
    })
    .join(", ")

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
      <div className="mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-full border border-border/70 bg-background/70">
        <div
          className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full"
          style={{ background: total > 0 ? `conic-gradient(${gradient})` : "var(--color-muted)" }}
        >
          <div className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full border border-border/70 bg-card text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{centerLabel}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">{centerValue}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {segments.map((segment) => {
          const percent = total > 0 ? Math.round((segment.value / total) * 100) : 0
          return (
            <div key={segment.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <div>
                  <p className="text-sm font-medium text-foreground">{segment.label}</p>
                  <p className="text-xs text-muted-foreground">{percent}% of tracked credits</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatCredits(segment.value)}</p>
                <p className={cn("text-xs", segment.chip)}>{segment.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrendChart({
  values,
  labels,
  empty,
  color = "var(--color-foreground)",
}: {
  values: number[]
  labels: string[]
  empty: string
  color?: string
}) {
  if (values.length === 0) {
    return <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">{empty}</div>
  }

  const width = 640
  const height = 220
  const linePath = buildLinePath(values, width, height)
  const areaPath = buildAreaPath(values, width, height)

  return (
    <div className="rounded-[24px] border border-border/65 bg-background/70 p-4">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height + 40}`} className="min-w-[640px]">
          <defs>
            <linearGradient id="usage-area-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((ratioLine) => (
            <line
              key={ratioLine}
              x1="0"
              x2={width}
              y1={height * ratioLine}
              y2={height * ratioLine}
              stroke="currentColor"
              className="text-border/70"
              strokeDasharray="6 8"
            />
          ))}

          <path d={areaPath} fill="url(#usage-area-fill)" />
          <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

          {values.map((value, index) => {
            const max = Math.max(...values, 1)
            const min = Math.min(...values, 0)
            const range = Math.max(max - min, 1)
            const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
            const y = height - ((value - min) / range) * height

            return (
              <g key={`trend-point-${index}-${labels[index] ?? "unknown"}-${value}`}>
                <circle cx={x} cy={y} r="4.5" fill="var(--color-background)" stroke={color} strokeWidth="3" />
                <text x={x} y={height + 24} textAnchor="middle" className="fill-[var(--color-muted-foreground)] text-[11px]">
                  {labels[index]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function VerticalBarChart({
  rows,
  empty,
  tone = "bg-foreground",
}: {
  rows: Array<{ label: string; value: number; helper?: string }>
  empty: string
  tone?: string
}) {
  if (rows.length === 0) {
    return <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">{empty}</div>
  }

  const max = Math.max(...rows.map((row) => row.value), 1)

  return (
    <div className="rounded-[24px] border border-border/65 bg-background/70 p-4">
      <div className="grid min-h-[260px] grid-cols-5 items-end gap-3 md:grid-cols-6 xl:grid-cols-8">
        {rows.map((row, index) => (
          <div key={`bar-${index}-${row.label}`} className="flex h-full flex-col justify-end gap-3">
            <div className="flex min-h-[200px] items-end">
              <div className="relative h-full w-full overflow-hidden rounded-t-2xl rounded-b-lg bg-muted/60">
                <div
                  className={cn("absolute inset-x-0 bottom-0 rounded-t-2xl", tone)}
                  style={{ height: `${Math.max((row.value / max) * 100, 6)}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{formatCredits(row.value)}</p>
              <p className="truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{row.label}</p>
              {row.helper ? <p className="mt-1 text-[11px] text-muted-foreground">{row.helper}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UsagePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const billingSummary = useQuery(
    api.billing.getUserBillingSummary,
    user?.id ? { userId: user.id } : "skip"
  )
  const usageDetails = useQuery(
    api.billing.getUserUsageDetails,
    user?.id ? { userId: user.id } : "skip"
  )

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user?.role === "admin") {
      router.push("/dashboard-admin/billing")
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading usage dashboard...
        </div>
      </div>
    )
  }

  const usage = usageDetails
  const summary = billingSummary

  const usageByAction = usage?.usageByAction ?? []
  const recentUsage = [...(usage?.recentUsage ?? [])].reverse()

  const trackedCreditSegments = [
    {
      label: "Current balance",
      value: summary?.balanceCredits ?? 0,
      color: "#111111",
      chip: "text-foreground",
    },
    {
      label: "Purchased",
      value: summary?.totalPurchasedCredits ?? 0,
      color: "#10b981",
      chip: "text-emerald-600 dark:text-emerald-300",
    },
    {
      label: "Spent",
      value: summary?.totalSpentCredits ?? 0,
      color: "#f59e0b",
      chip: "text-amber-600 dark:text-amber-300",
    },
  ]

  const balanceTrendValues = recentUsage.map((transaction) => transaction.balanceAfter)
  const balanceTrendLabels = recentUsage.map((transaction) => formatShortDate(transaction.createdAt))

  const usageIntensityRows = recentUsage.slice(-8).map((transaction) => ({
    label: formatShortDate(transaction.createdAt),
    value: Math.abs(transaction.creditsDelta),
    helper: `${transaction.quantity ?? 1} units`,
  }))

  const actionBars = usageByAction.map((item) => ({
    label: item.label,
    sublabel: item.actionKey,
    value: item.totalCredits,
    footer: `${item.totalRuns} runs · ${item.totalQuantity} units`,
  }))

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AppSidebar />
          </div>
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-amber-500/8 blur-3xl" />
        </div>

        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/82 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-card text-muted-foreground transition-colors hover:text-foreground md:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Usage</p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Credit analytics</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">
          <section className="mb-6 overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(15,118,110,0.94))] p-6 text-white shadow-[0_35px_90px_-45px_rgba(15,118,110,0.45)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-50/90">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Usage monitoring
                </div>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                  Every credit movement is visualized so you can spot spend patterns, balance trends, and package impact at a glance.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-emerald-50/75">Latest balance</p>
                    <WalletCards className="h-4 w-4 text-emerald-50/75" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                    {formatCredits(summary?.balanceCredits ?? 0)}
                  </p>
                </div>

                <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-emerald-50/75">Total spent</p>
                    <Activity className="h-4 w-4 text-emerald-50/75" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                    {formatCredits(summary?.totalSpentCredits ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Current balance"
              value={formatCredits(summary?.balanceCredits ?? 0)}
              helper="Credits ready to spend"
              icon={WalletCards}
            />
            <SummaryCard
              label="Purchased credits"
              value={formatCredits(summary?.totalPurchasedCredits ?? 0)}
              helper="Added through checkout"
              icon={CreditCard}
            />
            <SummaryCard
              label="Credits spent"
              value={formatCredits(summary?.totalSpentCredits ?? 0)}
              helper="Consumed by AI actions"
              icon={Activity}
            />
            <SummaryCard
              label="Usage events"
              value={formatCredits(usage?.totalUsageEvents ?? 0)}
              helper="Tracked debit entries"
              icon={BarChart3}
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <ChartShell
              eyebrow="Breakdown"
              title="Spend by action"
              icon={BarChart3}
            >
              <HorizontalBarChart
                rows={actionBars}
                empty="No usage has been tracked yet."
                colorClass="bg-[linear-gradient(90deg,var(--color-chart-1),var(--color-chart-2))]"
              />
            </ChartShell>

            <ChartShell
              eyebrow="Wallet mix"
              title="Credits in context"
              icon={WalletCards}
            >
              <DonutChart
                segments={trackedCreditSegments}
                centerLabel="Balance"
                centerValue={formatCredits(summary?.balanceCredits ?? 0)}
              />
            </ChartShell>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartShell
              eyebrow="Trend"
              title="Balance after each usage event"
              icon={TrendingUp}
            >
              <TrendChart
                values={balanceTrendValues}
                labels={balanceTrendLabels}
                empty="No usage trend yet."
              />
              {recentUsage.length > 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">First point</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{formatDate(recentUsage[0].createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest point</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{formatDate(recentUsage[recentUsage.length - 1].createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest balance</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{formatCredits(recentUsage[recentUsage.length - 1].balanceAfter)}</p>
                  </div>
                </div>
              ) : null}
            </ChartShell>

            <ChartShell
              eyebrow="Intensity"
              title="Recent usage size"
              icon={Clock3}
            >
              <VerticalBarChart
                rows={usageIntensityRows}
                empty="No recent usage intensity to chart."
                tone="bg-[linear-gradient(180deg,#f59e0b,#d97706)]"
              />
            </ChartShell>
          </section>

        </main>
      </div>
    </div>
  )
}


