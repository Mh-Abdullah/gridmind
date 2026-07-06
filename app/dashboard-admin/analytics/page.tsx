"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import {
  ArrowRightLeft,
  BarChart3,
  CreditCard,
  Gift,
  Loader2,
  Menu,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeatCard } from "@/components/ui/agent-bento-grid"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

function formatCredits(value: number) {
  return value.toLocaleString()
}

function formatDate(value?: number) {
  if (!value) return "-"

  return new Date(value).toLocaleDateString([], {
    dateStyle: "medium",
  })
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

function ratio(value: number, total: number) {
  if (total <= 0) return 0
  return (value / total) * 100
}

type CreditUser = {
  id: string
  email: string
  name?: string
  currentBalanceCredits: number
}

type PurchasedUser = CreditUser & {
  purchasedCredits: number
  purchasedUsedCredits: number
  purchasedRemainingCredits: number
  packagePurchases: number
  latestPurchaseAt?: number
}

type GrantedUser = CreditUser & {
  grantedCredits: number
  grantedUsedCredits: number
  grantedRemainingCredits: number
  packageGrantCount: number
}

function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: string
  tone?: "default" | "emerald" | "amber"
}) {
  return (
    <div
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium tracking-[0.02em]",
        tone === "emerald" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        tone === "amber" && "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        tone === "default" && "border-border/70 bg-background/80 text-muted-foreground"
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-2 text-foreground">{value}</span>
    </div>
  )
}

function MetricTile({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string
  value: string
  helper: string
  icon: typeof CreditCard
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-foreground/70" />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
    </div>
  )
}

function SegmentedBar({
  label,
  total,
  used,
  remaining,
  colors,
}: {
  label: string
  total: number
  used: number
  remaining: number
  colors: {
    used: string
    remaining: string
    text: string
  }
}) {
  const usedWidth = ratio(used, total)
  const remainingWidth = ratio(remaining, total)

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{formatCredits(total)} total credits</p>
        </div>
        <div className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", colors.text)}>
          {formatPercent(ratio(used, total))} used
        </div>
      </div>
      <div className="overflow-hidden rounded-full border border-border/60 bg-muted/40">
        <div className="flex h-3.5 w-full">
          <div className={cn(colors.used)} style={{ width: `${usedWidth}%` }} />
          <div className={cn(colors.remaining)} style={{ width: `${remainingWidth}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-border/60 bg-background/75 px-3 py-2 text-muted-foreground">
          Used <span className="ml-1 font-semibold text-foreground">{formatCredits(used)}</span>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/75 px-3 py-2 text-muted-foreground">
          Remaining <span className="ml-1 font-semibold text-foreground">{formatCredits(remaining)}</span>
        </div>
      </div>
    </div>
  )
}

function LeaderboardRow({
  item,
  primaryValue,
  secondaryValue,
  meta,
}: {
  item: CreditUser
  primaryValue: string
  secondaryValue: string
  meta: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{item.name || "User"}</p>
        <p className="truncate text-xs text-muted-foreground">{item.email}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-foreground">{primaryValue}</p>
        <p className="text-xs text-muted-foreground">{secondaryValue}</p>
        <p className="text-[11px] text-muted-foreground">{meta}</p>
      </div>
    </div>
  )
}

function DataTable({
  rows,
  columns,
}: {
  rows: Array<Record<string, string>>
  columns: string[]
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
        No records yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border/70 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.User}-${index}`} className="border-b border-border/60 last:border-0">
              {columns.map((column) => (
                <td key={column} className="px-3 py-3 align-top text-foreground">
                  {column === "User" ? (
                    <div>
                      <p className="font-medium text-foreground">{row.User}</p>
                      <p className="text-xs text-muted-foreground">{row.Email}</p>
                    </div>
                  ) : (
                    row[column]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const analytics = useQuery(api.billing.getAdminBillingAnalytics, isAdmin ? {} : "skip")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && !isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading analytics...
        </div>
      </div>
    )
  }

  const overview = analytics?.overview
  const purchasedUsers: PurchasedUser[] = analytics?.purchasedUsers ?? []
  const grantedUsers: GrantedUser[] = analytics?.grantedUsers ?? []

  const totalTrackedCredits = (overview?.totalPurchasedCredits ?? 0) + (overview?.totalGrantedCredits ?? 0)
  const totalTrackedRemaining =
    (overview?.totalPurchasedRemainingCredits ?? 0) + (overview?.totalGrantedRemainingCredits ?? 0)
  const totalTrackedUsed = (overview?.totalPurchasedUsedCredits ?? 0) + (overview?.totalGrantedUsedCredits ?? 0)
  const purchaseShare = ratio(overview?.totalPurchasedCredits ?? 0, totalTrackedCredits)
  const grantShare = ratio(overview?.totalGrantedCredits ?? 0, totalTrackedCredits)
  const latestPurchase = purchasedUsers
    .map((item) => item.latestPurchaseAt)
    .filter((value): value is number => Boolean(value))
    .sort((a, b) => b - a)[0]

  const purchasedTableRows = purchasedUsers.slice(0, 10).map((item) => ({
    User: item.name || "User",
    Email: item.email,
    Purchased: formatCredits(item.purchasedCredits),
    Used: formatCredits(item.purchasedUsedCredits),
    Remaining: formatCredits(item.purchasedRemainingCredits),
    Wallet: formatCredits(item.currentBalanceCredits),
    Orders: String(item.packagePurchases),
    "Latest Purchase": formatDate(item.latestPurchaseAt),
  }))

  const grantedTableRows = grantedUsers.slice(0, 10).map((item) => ({
    User: item.name || "User",
    Email: item.email,
    Granted: formatCredits(item.grantedCredits),
    Used: formatCredits(item.grantedUsedCredits),
    Remaining: formatCredits(item.grantedRemainingCredits),
    Wallet: formatCredits(item.currentBalanceCredits),
    Grants: String(item.packageGrantCount),
  }))

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-500/8 blur-3xl" />
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Analytics</p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Billing command center</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="relative flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">
          <section className="mb-6 rounded-[32px] border border-border/70 bg-card/85 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin finance view</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-foreground md:text-4xl">
                  See where credits are coming from, how quickly they burn, and who is holding the largest balances.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                  This view blends purchased-credit performance with admin grants so you can spot idle balances, high-usage accounts,
                  and the most recent commercial activity without jumping between pages.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <StatPill label="Tracked credits" value={formatCredits(totalTrackedCredits)} />
                <StatPill label="Still available" value={formatCredits(totalTrackedRemaining)} tone="emerald" />
                <StatPill label="Already used" value={formatCredits(totalTrackedUsed)} tone="amber" />
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-12">
            <FeatCard
              title="Credit mix"
              description="A quick read on how purchased and granted credits are split, along with how much of each pool has already been consumed."
              className="lg:col-span-5 min-h-[360px]"
            >
              <div className="flex h-full flex-col gap-5 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Purchased share</p>
                    <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground">{formatPercent(purchaseShare)}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatCredits(overview?.totalPurchasedCredits ?? 0)} credits sold</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Grant share</p>
                    <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-foreground">{formatPercent(grantShare)}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatCredits(overview?.totalGrantedCredits ?? 0)} credits granted</p>
                  </div>
                </div>

                <div className="grid flex-1 gap-4">
                  <SegmentedBar
                    label="Purchased credits"
                    total={overview?.totalPurchasedCredits ?? 0}
                    used={overview?.totalPurchasedUsedCredits ?? 0}
                    remaining={overview?.totalPurchasedRemainingCredits ?? 0}
                    colors={{
                      used: "bg-foreground",
                      remaining: "bg-emerald-400/70",
                      text: "bg-foreground/6 text-foreground",
                    }}
                  />
                  <SegmentedBar
                    label="Admin-granted credits"
                    total={overview?.totalGrantedCredits ?? 0}
                    used={overview?.totalGrantedUsedCredits ?? 0}
                    remaining={overview?.totalGrantedRemainingCredits ?? 0}
                    colors={{
                      used: "bg-amber-500/85",
                      remaining: "bg-sky-400/75",
                      text: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                    }}
                  />
                </div>
              </div>
            </FeatCard>

            <FeatCard
              title="Snapshot"
              description="The high-level counts that matter when you need a fast pulse on monetized accounts and granted wallets."
              className="lg:col-span-3 min-h-[360px]"
            >
              <div className="grid h-full gap-3 p-4">
                <MetricTile
                  label="Purchased users"
                  value={String(overview?.purchasedUsers ?? 0)}
                  helper="Users with paid credit history"
                  icon={CreditCard}
                />
                <MetricTile
                  label="Granted users"
                  value={String(overview?.grantedUsers ?? 0)}
                  helper="Users touched by admin grants"
                  icon={Gift}
                />
                <MetricTile
                  label="Purchased used"
                  value={formatCredits(overview?.totalPurchasedUsedCredits ?? 0)}
                  helper="Consumed from paid balances"
                  icon={BarChart3}
                />
                <MetricTile
                  label="Granted used"
                  value={formatCredits(overview?.totalGrantedUsedCredits ?? 0)}
                  helper="Consumed from admin allocations"
                  icon={Wallet}
                />
              </div>
            </FeatCard>

            <FeatCard
              title="Flow signals"
              description="A lightweight operations readout for recent commerce, active balances, and the gap between sold and granted credits."
              className="lg:col-span-4 min-h-[360px]"
            >
              <div className="flex h-full flex-col gap-3 p-4">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Latest purchase</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">{formatDate(latestPurchase)}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-background">
                      <Sparkles className="h-4 w-4 text-foreground/70" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Available to users</p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                        {formatCredits(totalTrackedRemaining)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">Across paid and granted balances still sitting in wallets.</p>
                    </div>
                    <TrendingUp className="mt-1 h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Sold volume</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {formatCredits(overview?.totalPurchasedCredits ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Grant volume</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-foreground">
                      {formatCredits(overview?.totalGrantedCredits ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            </FeatCard>

            <FeatCard
              title="Top purchased accounts"
              description="The accounts with the largest purchased allocations, including what they have left and how many orders created those balances."
              className="lg:col-span-7 min-h-[380px]"
            >
              <div className="flex h-full flex-col gap-3 p-4">
                {purchasedUsers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    No purchased accounts yet.
                  </div>
                ) : (
                  purchasedUsers.slice(0, 6).map((item) => (
                    <LeaderboardRow
                      key={item.id}
                      item={item}
                      primaryValue={`${formatCredits(item.purchasedCredits)} purchased`}
                      secondaryValue={`${formatCredits(item.purchasedRemainingCredits)} left`}
                      meta={`${item.packagePurchases} orders`}
                    />
                  ))
                )}
              </div>
            </FeatCard>

            <FeatCard
              title="Top granted accounts"
              description="Admin-assisted balances ranked by grant volume, useful for spotting large discretionary allocations that remain unused."
              className="lg:col-span-5 min-h-[380px]"
            >
              <div className="flex h-full flex-col gap-3 p-4">
                {grantedUsers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    No granted accounts yet.
                  </div>
                ) : (
                  grantedUsers.slice(0, 6).map((item) => (
                    <LeaderboardRow
                      key={item.id}
                      item={item}
                      primaryValue={`${formatCredits(item.grantedCredits)} granted`}
                      secondaryValue={`${formatCredits(item.grantedRemainingCredits)} left`}
                      meta={`${item.packageGrantCount} grant events`}
                    />
                  ))
                )}
              </div>
            </FeatCard>

            <FeatCard
              title="Purchased package ledger"
              description="Detailed records for monetized users, including purchased totals, burn, remaining balance, and most recent order date."
              className="lg:col-span-7 min-h-[420px]"
            >
              <div className="p-4">
                <DataTable
                  columns={["User", "Purchased", "Used", "Remaining", "Wallet", "Orders", "Latest Purchase"]}
                  rows={purchasedTableRows}
                />
              </div>
            </FeatCard>

            <FeatCard
              title="Admin grant ledger"
              description="Detailed records for users with manual or admin package grants, including current wallet position and remaining credit exposure."
              className="lg:col-span-5 min-h-[420px]"
            >
              <div className="p-4">
                <DataTable
                  columns={["User", "Granted", "Used", "Remaining", "Wallet", "Grants"]}
                  rows={grantedTableRows}
                />
              </div>
            </FeatCard>
          </section>

          <section className="mt-6 rounded-[28px] border border-border/70 bg-card/85 p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Readout</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">What this page is telling you</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Purchased vs granted credit exposure
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">
                Purchased credits make up <span className="font-semibold text-foreground">{formatPercent(purchaseShare)}</span> of tracked volume.
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">
                Users still hold <span className="font-semibold text-foreground">{formatCredits(totalTrackedRemaining)}</span> credits across all tracked wallets.
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">
                The most recent paid credit event landed on <span className="font-semibold text-foreground">{formatDate(latestPurchase)}</span>.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

