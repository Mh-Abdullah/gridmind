"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { PolarAngleAxis } from "recharts"
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
import { BackToTablesButton } from "@/components/back-to-tables-button"
import {
  ActiveDot,
  Dot,
  EvilLineChart,
  Grid,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/evilcharts/charts/line-chart"
import {
  EvilRadialChart,
  Legend as RadialLegend,
  RadialBar,
  Tooltip as RadialTooltip,
} from "@/components/evilcharts/charts/radial-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { UsageMonospaceBarChart } from "@/components/usage-monospace-bar-chart"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

function formatCredits(value: number) {
  return value.toLocaleString()
}

function formatShortDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })
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

function WalletMixRadialChart({
  segments,
}: {
  segments: Array<{ key: string; label: string; value: number; color: string; chip: string }>
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  const chartData = segments.map((segment) => ({
    name: segment.key,
    value: total > 0 ? Math.round((segment.value / total) * 100) : 0,
    credits: segment.value,
  }))
  const chartConfig = Object.fromEntries(
    segments.map((segment) => [
      segment.key,
      {
        label: segment.label,
        colors: {
          light: [segment.color],
        },
      },
    ])
  )

  return (
    <div className="flex justify-center">
      <EvilRadialChart
        data={chartData}
        config={chartConfig}
        nameKey="name"
        innerRadius="22%"
        outerRadius="94%"
        defaultSelectedDataKey={segments[0]?.key ?? null}
        className="h-[360px] w-full max-w-[460px] [aspect-ratio:auto]"
        chartProps={{ margin: { top: 24, right: 34, bottom: 42, left: 34 } }}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialTooltip variant="frosted-glass" roundness="xl" defaultIndex={0} />
        <RadialBar
          dataKey="value"
          barSize={16}
          cornerRadius={10}
          isClickable
          glowingBars={segments.slice(-1).map((segment) => segment.key)}
        />
        <RadialLegend variant="circle" align="center" verticalAlign="bottom" isClickable />
      </EvilRadialChart>
    </div>
  )
}

function TrendChart({
  values,
  labels,
  empty,
}: {
  values: number[]
  labels: string[]
  empty: string
}) {
  if (values.length === 0) {
    return <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">{empty}</div>
  }

  const chartData = values.map((value, index) => {
    const windowValues = values.slice(Math.max(index - 2, 0), index + 1)
    const average = Math.round(windowValues.reduce((total, current) => total + current, 0) / windowValues.length)

    return {
      label: labels[index] ?? `Point ${index + 1}`,
      balance: value,
      average,
    }
  })
  const chartConfig = {
    balance: {
      label: "Balance",
      colors: {
        light: ["#ff3b30", "#ff9500", "#f5a400", "#af52de", "#3b22ff"],
      },
    },
    average: {
      label: "Moving avg",
      colors: {
        light: ["#8c8c8c"],
      },
    },
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background p-4 shadow-[0_28px_80px_-62px_var(--gm-amber)]">
      <div>
        <div className="mb-2 flex justify-end gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[var(--gm-amber)]" />
            Balance
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-muted-foreground/65" />
            Moving avg
          </span>
        </div>
        <EvilLineChart
          data={chartData}
          config={chartConfig}
          curveType="bump"
          animationType="left-to-right"
          defaultSelectedDataKey="balance"
          showBrush
          xDataKey="label"
          brushHeight={54}
          brushFormatLabel={(value) => String(value)}
          className="h-[390px] rounded-[20px]"
          chartProps={{ margin: { top: 22, right: 22, bottom: 14, left: 8 } }}
        >
          <Grid strokeOpacity={0.36} />
          <XAxis dataKey="label" interval="preserveStartEnd" tickMargin={16} />
          <YAxis tickFormatter={(value) => formatCredits(Number(value))} width={64} />
          <Legend variant="rounded-square" isClickable />
          <Tooltip variant="frosted-glass" roundness="xl" defaultIndex={chartData.length - 1} />
          <Line dataKey="balance" animationType="left-to-right" glowing isClickable enableBufferLine>
            <Dot variant="border" />
            <ActiveDot variant="colored-border" />
          </Line>
          <Line dataKey="average" animationType="left-to-right" strokeVariant="dashed" isClickable>
            <ActiveDot variant="default" />
          </Line>
        </EvilLineChart>
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
      key: "balance",
      label: "Current balance",
      value: summary?.balanceCredits ?? 0,
      color: "#3b82f6",
      chip: "text-blue-600 dark:text-blue-300",
    },
    {
      key: "purchased",
      label: "Purchased",
      value: summary?.totalPurchasedCredits ?? 0,
      color: "#10b981",
      chip: "text-emerald-600 dark:text-emerald-300",
    },
    {
      key: "spent",
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

        <header className="border-b border-border bg-background px-4 md:px-8 h-16 flex items-center justify-between shrink-0">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <BackToTablesButton />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">Usage</p>
                <h1 className="text-lg font-semibold text-foreground">Credit analytics</h1>
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

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
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
              <WalletMixRadialChart
                segments={trackedCreditSegments}
              />
            </ChartShell>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
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
            </ChartShell>

            <ChartShell
              eyebrow="Intensity"
              title="Recent usage size"
              icon={Clock3}
            >
              <UsageMonospaceBarChart
                rows={usageIntensityRows}
                empty="No recent usage intensity to chart."
              />
            </ChartShell>
          </section>

        </main>
      </div>
    </div>
  )
}


