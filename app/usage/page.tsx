"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { Activity, BarChart3, Clock3, Loader2, Menu, ReceiptText, Sparkles, WalletCards } from "lucide-react"

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

function transactionTone(type: "grant" | "debit" | "refund") {
  if (type === "debit") {
    return {
      badge: "Used",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      deltaPrefix: "-",
    }
  }

  if (type === "refund") {
    return {
      badge: "Refunded",
      className: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      deltaPrefix: "+",
    }
  }

  return {
    badge: "Added",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    deltaPrefix: "+",
  }
}

function allocationTone(source: "admin" | "polar_order" | "refund") {
  if (source === "polar_order") {
    return {
      label: "Purchased",
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    }
  }

  if (source === "refund") {
    return {
      label: "Refund",
      className: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    }
  }

  return {
    label: "Admin",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  }
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
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Credit usage tracking</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Current balance",
                value: formatCredits(summary?.balanceCredits ?? 0),
                helper: "Ready to spend",
                icon: WalletCards,
              },
              {
                label: "Purchased credits",
                value: formatCredits(summary?.totalPurchasedCredits ?? 0),
                helper: "Bought through checkout",
                icon: Sparkles,
              },
              {
                label: "Credits spent",
                value: formatCredits(summary?.totalSpentCredits ?? 0),
                helper: "Used across AI actions",
                icon: Activity,
              },
              {
                label: "Usage events",
                value: formatCredits(usage?.totalUsageEvents ?? 0),
                helper: "Tracked debit transactions",
                icon: BarChart3,
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[26px] border border-border/70 bg-card/92 p-5 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.45)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.helper}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Breakdown</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Usage by action</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {(usage?.usageByAction ?? []).length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    No usage has been tracked yet.
                  </div>
                ) : (
                  usage?.usageByAction.map((item) => (
                    <article key={item.actionKey} className="rounded-[22px] border border-border/65 bg-background/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.actionKey}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold tracking-[-0.03em] text-amber-600 dark:text-amber-300">
                            -{formatCredits(item.totalCredits)}
                          </p>
                          <p className="text-xs text-muted-foreground">credits</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
                          Runs: <span className="font-medium text-foreground">{item.totalRuns}</span>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
                          Units: <span className="font-medium text-foreground">{item.totalQuantity}</span>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background/70 px-2.5 py-2">
                          Last: <span className="font-medium text-foreground">{new Date(item.lastUsedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Timeline</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Recent usage events</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {(usage?.recentUsage ?? []).length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    No usage transactions yet.
                  </div>
                ) : (
                  usage?.recentUsage.map((transaction) => (
                    <article
                      key={transaction._id}
                      className="rounded-[22px] border border-border/65 bg-background/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                              Used
                            </span>
                            <span className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-foreground">{transaction.note || transaction.actionKey || "Usage event"}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {transaction.actionKey && <span>Action: {transaction.actionKey}</span>}
                            <span>Units: {transaction.quantity ?? 1}</span>
                            <span>Balance after: {formatCredits(transaction.balanceAfter)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-xl font-semibold tracking-[-0.03em]", "text-amber-600 dark:text-amber-300")}>
                            -{formatCredits(Math.abs(transaction.creditsDelta))}
                          </p>
                          <p className="text-xs text-muted-foreground">credits</p>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
              <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recent activity</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Billing timeline</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Every credit movement is tracked here, including purchases, consumption, and refunds.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Latest 10 events
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {(summary?.recentTransactions ?? []).length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-border/70 bg-background/60 p-6 text-sm text-muted-foreground">
                    No wallet activity yet. Buy your first credit package to start populating your timeline.
                  </div>
                ) : (
                  summary?.recentTransactions.map((transaction) => {
                    const tone = transactionTone(transaction.type)

                    return (
                      <article
                        key={transaction._id}
                        className="flex flex-col gap-4 rounded-[24px] border border-border/65 bg-background/70 p-4 transition-colors hover:border-primary/20 hover:bg-primary/5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", tone.className)}>
                              {tone.badge}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-foreground">{transaction.note || "Billing update"}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {transaction.actionKey && <span>Action: {transaction.actionKey}</span>}
                            {transaction.type === "debit" && <span>Units: {transaction.quantity ?? 1}</span>}
                            <span>Balance after: {formatCredits(transaction.balanceAfter)}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p
                            className={cn(
                              "text-xl font-semibold tracking-[-0.03em]",
                              transaction.type === "debit" ? "text-amber-600 dark:text-amber-300" : "text-emerald-600 dark:text-emerald-300"
                            )}
                          >
                            {tone.deltaPrefix}
                            {formatCredits(Math.abs(transaction.creditsDelta))}
                          </p>
                          <p className="text-xs text-muted-foreground">Credits</p>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </div>

            <section className="rounded-[30px] border border-border/70 bg-card/92 p-6 shadow-[0_28px_75px_-50px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Package allocations</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Credits added to wallet</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                This shows exactly how many credits each package added, so you can confirm wallet allocations after checkout.
              </p>

              <div className="mt-5 space-y-3">
                {(summary?.recentPackageAllocations ?? []).length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    No package allocations are showing yet. If you just paid, the Polar webhook may still be pending.
                  </div>
                ) : (
                  summary?.recentPackageAllocations.map((allocation) => {
                    const tone = allocationTone(allocation.source)

                    return (
                      <article
                        key={allocation._id}
                        className="rounded-[22px] border border-border/65 bg-background/70 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]", tone.className)}>
                                {tone.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(allocation.createdAt)}
                              </span>
                            </div>
                            <p className="mt-3 text-sm font-medium text-foreground">{allocation.packageName}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {allocation.note || "Wallet allocation recorded"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-semibold tracking-[-0.03em] text-emerald-600 dark:text-emerald-300">
                              +{formatCredits(allocation.creditsGranted)}
                            </p>
                            <p className="text-xs text-muted-foreground">credits</p>
                          </div>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  )
}
