"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useQuery } from "convex/react"
import {
  ArrowUpRight,
  Check,
  Clock3,
  Loader2,
  Menu,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/lib/auth-context"
import { formatPackagePeriod } from "@/lib/package-period"
import { cn } from "@/lib/utils"

function formatCredits(value: number) {
  return value.toLocaleString()
}

function formatMoneyFromCents(value: number) {
  return `$${(value / 100).toFixed(2)}`
}

function formatLockDate(timestamp?: number) {
  if (!timestamp) {
    return "already active"
  }

  return new Date(timestamp).toLocaleDateString([], {
    dateStyle: "medium",
  })
}

export default function BillingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null)
  const [isConfirmingCheckout, setIsConfirmingCheckout] = useState(false)

  const billingSummary = useQuery(
    api.billing.getUserBillingSummary,
    user?.id ? { userId: user.id } : "skip"
  )
  const publicPackages = useQuery(
    api.billing.getPublicPackages,
    user?.id ? { userId: user.id } : {}
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

  const packages = publicPackages ?? []
  const checkoutError = searchParams.get("checkoutError")
  const checkoutState = searchParams.get("checkout")
  const checkoutId = searchParams.get("checkout_id")
  const checkoutPackageId = searchParams.get("packageId")
  const summary = billingSummary
  const latestPurchasedAllocation = summary?.recentPackageAllocations?.find((item) => item.source === "polar_order")
  const featuredPackage =
    packages.find((item) => item.isFeatured && item.polarProductId && !item.isLockedForUser) ??
    packages.find((item) => item.polarProductId && !item.isLockedForUser)

  useEffect(() => {
    if (!user?.id || checkoutState !== "success" || !checkoutId || !checkoutPackageId) {
      return
    }

    let cancelled = false

    const confirmCheckout = async () => {
      setIsConfirmingCheckout(true)

      try {
        for (let attempt = 0; attempt < 4; attempt += 1) {
          const response = await fetch(
            `/api/billing/confirm?checkoutId=${encodeURIComponent(checkoutId)}&packageId=${encodeURIComponent(checkoutPackageId)}`,
            { cache: "no-store" }
          )
          const payload = await response.json()

          if (cancelled) {
            return
          }

          if (!response.ok) {
            setCheckoutNotice(payload.error || "Payment succeeded, but package activation is still pending.")
            return
          }

          if (payload.granted) {
            setCheckoutNotice("Payment confirmed and credits were added to your wallet.")
            router.refresh()
            return
          }

          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            continue
          }
        }

        setCheckoutNotice("Payment was received. Package activation is still processing, so please refresh in a moment.")
      } catch {
        if (!cancelled) {
          setCheckoutNotice("Payment returned successfully, but package confirmation could not be verified yet.")
        }
      } finally {
        if (!cancelled) {
          setIsConfirmingCheckout(false)
        }
      }
    }

    void confirmCheckout()

    return () => {
      cancelled = true
    }
  }, [checkoutId, checkoutPackageId, checkoutState, router, user?.id])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-[0_20px_50px_-35px_rgba(15,23,42,0.4)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading billing workspace...
        </div>
      </div>
    )
  }

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
          <div className="absolute left-[-10%] top-[-3rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,_rgba(37,99,235,0.16),_transparent_64%)] blur-3xl" />
          <div className="absolute right-[-8%] top-[16rem] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,_rgba(14,165,233,0.14),_transparent_60%)] blur-3xl" />
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Billing</p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Wallet and payments</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="relative flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">
          {checkoutError === "package-active" && (
            <div className="mb-6 rounded-[24px] border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              This package is already active on your account. You can buy it again after its billing period ends.
            </div>
          )}
          {checkoutNotice && (
            <div className="mb-6 rounded-[24px] border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
              {checkoutNotice}
            </div>
          )}
          {isConfirmingCheckout && (
            <div className="mb-6 rounded-[24px] border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              Confirming your payment and activating the package...
            </div>
          )}

          <section className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(29,78,216,0.95))] p-6 text-white shadow-[0_35px_90px_-45px_rgba(37,99,235,0.5)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-50/90">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure checkout via Polar
                </div>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
                  Buy credits from the available packages in one place.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/85 md:text-base">
                  Credits power GridMind actions. Choose an available package, complete checkout in Polar, and track
                  wallet activity from the Usage workspace.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="h-12 bg-white text-slate-950 hover:bg-white/92"
                    asChild={Boolean(featuredPackage)}
                    disabled={!featuredPackage}
                  >
                    {featuredPackage ? (
                      <Link href={`/api/billing/checkout?packageId=${featuredPackage.id}`}>
                        Buy featured credits
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span>No available package to buy right now</span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-blue-100/80">Available credits</p>
                    <WalletCards className="h-4 w-4 text-blue-100/80" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                    {formatCredits(summary?.balanceCredits ?? 0)}
                  </p>
                  <p className="mt-2 text-sm text-blue-100/75">Spend these across chat, agents, enrichment, and scraping.</p>
                </div>

                <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-blue-100/80">Credits purchased</p>
                    <Sparkles className="h-4 w-4 text-blue-100/80" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
                    {formatCredits(summary?.totalPurchasedCredits ?? 0)}
                  </p>
                  <p className="mt-2 text-sm text-blue-100/75">
                    {latestPurchasedAllocation
                      ? `Latest package: ${latestPurchasedAllocation.packageName} (+${formatCredits(latestPurchasedAllocation.creditsGranted)})`
                      : "Manual admin grants are tracked separately below."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="packages" className="mt-6 rounded-[32px] border border-border/70 bg-card/92 p-6 shadow-[0_30px_80px_-52px_rgba(15,23,42,0.45)] md:p-7">
            <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Packages</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Available credit plans</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Packages update live
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-3">
              {packages.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-border/70 bg-background/65 p-6 text-sm text-muted-foreground xl:col-span-3">
                  No live credit packages are available yet. An admin needs to publish and connect at least one package
                  in the billing control center.
                </div>
              ) : (
                packages.map((pkg) => (
                  <article
                    key={pkg.id}
                    className={cn(
                      "relative flex flex-col overflow-hidden rounded-[28px] border p-6 shadow-[0_26px_70px_-48px_rgba(15,23,42,0.45)] transition-all duration-300",
                      pkg.isLockedForUser ? "opacity-60 saturate-75" : "hover:-translate-y-1 hover:border-primary/20",
                      pkg.isFeatured
                        ? "border-primary/20 bg-[linear-gradient(180deg,rgba(37,99,235,0.08),rgba(255,255,255,0.96))] dark:bg-[linear-gradient(180deg,rgba(37,99,235,0.16),rgba(8,11,19,0.96))]"
                        : "border-border/70 bg-background/80"
                    )}
                  >
                    {pkg.isFeatured && (
                      <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                        Featured
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{pkg.name}</p>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
                          {formatMoneyFromCents(pkg.salePriceCents)}
                        </span>
                        <span className="pb-1 text-sm text-muted-foreground">one-time</span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        {pkg.description || "Credit package configured by your admin team."}
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3">
                      <li className="flex items-start gap-3 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {formatCredits(pkg.credits)} credits included
                      </li>
                      <li className="flex items-start gap-3 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        Valid for {formatPackagePeriod(pkg.periodMonths).toLowerCase()}
                      </li>
                      <li className="flex items-start gap-3 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {pkg.polarProductId ? "Checkout connected" : "Checkout not linked yet"}
                      </li>
                      {pkg.isLockedForUser && (
                        <li className="flex items-start gap-3 text-sm text-foreground">
                          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                          Active until {formatLockDate(pkg.lockedUntil)}
                        </li>
                      )}
                    </ul>

                    <div className="mt-6 pt-2">
                      <Button
                        className="w-full"
                        variant={pkg.isFeatured ? "default" : "outline"}
                        asChild={Boolean(pkg.polarProductId && !pkg.isLockedForUser)}
                        disabled={!pkg.polarProductId || pkg.isLockedForUser}
                      >
                        {pkg.polarProductId && !pkg.isLockedForUser ? (
                          <Link href={`/api/billing/checkout?packageId=${pkg.id}`}>
                            Buy {pkg.name}
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        ) : pkg.isLockedForUser ? (
                          <span>Already active until {formatLockDate(pkg.lockedUntil)}</span>
                        ) : (
                          <span>Waiting for checkout link</span>
                        )}
                      </Button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
