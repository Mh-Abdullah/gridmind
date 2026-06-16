"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { BarChart3, CreditCard, Gift, Loader2, Menu, Wallet } from "lucide-react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"

function formatCredits(value: number) {
  return value.toLocaleString()
}

function formatDate(value?: number) {
  if (!value) return "—"

  return new Date(value).toLocaleDateString([], {
    dateStyle: "medium",
  })
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
  const purchasedUsers = analytics?.purchasedUsers ?? []
  const grantedUsers = analytics?.grantedUsers ?? []

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-background px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Analytics</p>
                <h1 className="text-xl font-bold text-foreground md:text-2xl">Billing analytics</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Credit allocation insights</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor users who purchased packages and users who received admin-granted credits, including used and remaining balances.
            </p>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Purchased users</p>
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">{overview?.purchasedUsers ?? 0}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatCredits(overview?.totalPurchasedRemainingCredits ?? 0)} credits still remaining
              </p>
            </article>

            <article className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Purchased used</p>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {formatCredits(overview?.totalPurchasedUsedCredits ?? 0)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                From {formatCredits(overview?.totalPurchasedCredits ?? 0)} purchased credits
              </p>
            </article>

            <article className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Granted users</p>
                <Gift className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">{overview?.grantedUsers ?? 0}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatCredits(overview?.totalGrantedRemainingCredits ?? 0)} granted credits still remaining
              </p>
            </article>

            <article className="rounded-[24px] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Granted used</p>
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {formatCredits(overview?.totalGrantedUsedCredits ?? 0)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                From {formatCredits(overview?.totalGrantedCredits ?? 0)} admin-granted credits
              </p>
            </article>
          </section>

          <section className="mt-6 rounded-[28px] border border-border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Purchased packages</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">Users who purchased packages</h3>
            </div>

            {purchasedUsers.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                No users have purchased a package yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="px-3 py-3 font-medium">User</th>
                      <th className="px-3 py-3 font-medium">Purchased</th>
                      <th className="px-3 py-3 font-medium">Used</th>
                      <th className="px-3 py-3 font-medium">Remaining</th>
                      <th className="px-3 py-3 font-medium">Wallet Balance</th>
                      <th className="px-3 py-3 font-medium">Purchases</th>
                      <th className="px-3 py-3 font-medium">Latest Purchase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasedUsers.map((item) => (
                      <tr key={item.id} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-3">
                          <div>
                            <p className="font-medium text-foreground">{item.name || "User"}</p>
                            <p className="text-xs text-muted-foreground">{item.email}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.purchasedCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.purchasedUsedCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.purchasedRemainingCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.currentBalanceCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{item.packagePurchases}</td>
                        <td className="px-3 py-3 text-foreground">{formatDate(item.latestPurchaseAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-6 rounded-[28px] border border-border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Granted credits</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">Users with admin-granted credits</h3>
            </div>

            {grantedUsers.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-border bg-background/60 p-4 text-sm text-muted-foreground">
                No users have received admin-granted credits yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="px-3 py-3 font-medium">User</th>
                      <th className="px-3 py-3 font-medium">Granted</th>
                      <th className="px-3 py-3 font-medium">Used</th>
                      <th className="px-3 py-3 font-medium">Remaining</th>
                      <th className="px-3 py-3 font-medium">Wallet Balance</th>
                      <th className="px-3 py-3 font-medium">Package Grants</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grantedUsers.map((item) => (
                      <tr key={item.id} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-3">
                          <div>
                            <p className="font-medium text-foreground">{item.name || "User"}</p>
                            <p className="text-xs text-muted-foreground">{item.email}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.grantedCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.grantedUsedCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.grantedRemainingCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{formatCredits(item.currentBalanceCredits)}</td>
                        <td className="px-3 py-3 text-foreground">{item.packageGrantCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
