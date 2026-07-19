"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FREE_TIER_CREDITS } from "@/lib/access-policy"
import { formatPackagePeriod, parsePackageDescription } from "@/lib/package-period"

type PackageFormState = {
  packageId?: string
  name: string
  slug: string
  description: string
  periodMonths: string
  credits: string
  salePriceCents: string
  polarProductId: string
  isActive: boolean
  isFeatured: boolean
  autoSyncToPolar: boolean
}

const emptyPackageForm: PackageFormState = {
  name: "",
  slug: "",
  description: "",
  periodMonths: "1",
  credits: "2500",
  salePriceCents: "1999",
  polarProductId: "",
  isActive: true,
  isFeatured: false,
  autoSyncToPolar: true,
}

function isSoftDeletedPackage(pkg: { description?: string }) {
  return parsePackageDescription(pkg.description).isDeleted
}

function formatMoneyFromCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
    </label>
  )
}

export function AdminBillingPanel({ adminUserId }: { adminUserId: string }) {
  const overview = useQuery(api.billing.getAdminOverview, {})
  const upsertPackage = useMutation(api.billing.upsertPackage)
  const deletePackage = useMutation(api.billing.deletePackage)
  const grantManualCredits = useMutation(api.billing.grantManualCredits)
  const updateBillingSettings = useMutation(api.billing.updateBillingSettings)

  const [packageForm, setPackageForm] = useState<PackageFormState>(emptyPackageForm)
  const [manualCreditEmail, setManualCreditEmail] = useState("")
  const [manualCreditAmount, setManualCreditAmount] = useState("")
  const [manualCreditNote, setManualCreditNote] = useState("")
  const [initialCreditsDraft, setInitialCreditsDraft] = useState("")
  const [savingPackage, setSavingPackage] = useState(false)
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null)
  const [syncingPackageId, setSyncingPackageId] = useState<string | null>(null)
  const [grantingManualCredits, setGrantingManualCredits] = useState(false)
  const [savingInitialCredits, setSavingInitialCredits] = useState(false)

  const visiblePackages = useMemo(
    () =>
      overview?.packages
        .filter((pkg) => !isSoftDeletedPackage(pkg))
        .map((pkg) => {
          const parsed = parsePackageDescription(pkg.description)
          return {
            ...pkg,
            description: parsed.description,
            periodMonths: parsed.periodMonths,
          }
        }) ?? [],
    [overview]
  )

  useEffect(() => {
    if (!overview) return

    setInitialCreditsDraft(String(overview.settings?.initialCredits ?? FREE_TIER_CREDITS))
  }, [overview])

  const handleSaveInitialCredits = async () => {
    setSavingInitialCredits(true)
    try {
      await updateBillingSettings({
        adminUserId: adminUserId as never,
        initialCredits: Number(initialCreditsDraft || 0),
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save initial credits")
    } finally {
      setSavingInitialCredits(false)
    }
  }

  const syncPackageToPolar = async (packageId: string) => {
    setSyncingPackageId(packageId)
    try {
      const response = await fetch("/api/admin/billing/sync-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to sync package to Polar")
      }

      return data as { mode: "created" | "updated"; productId: string }
    } finally {
      setSyncingPackageId(null)
    }
  }

  const handlePackageSubmit = async () => {
    setSavingPackage(true)
    try {
      const packageId = await upsertPackage({
        adminUserId: adminUserId as never,
        packageId: packageForm.packageId ? (packageForm.packageId as never) : undefined,
        name: packageForm.name,
        slug: packageForm.slug || undefined,
        description: packageForm.description || undefined,
        periodMonths: Number(packageForm.periodMonths || 0),
        credits: Number(packageForm.credits),
        internalCostCents: Number(packageForm.salePriceCents),
        markupMultiplier: 1,
        polarProductId: packageForm.polarProductId || undefined,
        polarSyncedAt: undefined,
        isActive: packageForm.isActive,
        isFeatured: packageForm.isFeatured,
      })

      const createdOrUpdatedLabel = packageForm.packageId ? "Package updated" : "Package created"

      if (packageForm.autoSyncToPolar) {
        try {
          await syncPackageToPolar(String(packageId))
        } catch (error) {
          setPackageForm(emptyPackageForm)
          alert(
            `${createdOrUpdatedLabel} locally, but Polar sync failed. Update POLAR_ACCESS_TOKEN in .env.local or turn off auto-sync.\n\n${
              error instanceof Error ? error.message : "Failed to sync package to Polar"
            }`
          )
          return
        }
      }

      setPackageForm(emptyPackageForm)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save package")
    } finally {
      setSavingPackage(false)
    }
  }

  const handleGrantManualCredits = async () => {
    if (!manualCreditEmail.trim() || !manualCreditAmount.trim()) return
    setGrantingManualCredits(true)
    try {
      await grantManualCredits({
        adminUserId: adminUserId as never,
        email: manualCreditEmail.trim() as never,
        credits: Number(manualCreditAmount) as never,
        note: manualCreditNote || undefined,
      })
      setManualCreditAmount("")
      setManualCreditNote("")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to grant manual credits")
    } finally {
      setGrantingManualCredits(false)
    }
  }

  const handleDeletePackage = async (pkg: {
    _id: string
    name: string
    slug: string
    description?: string
    periodMonths?: number
    credits: number
    salePriceCents: number
    polarProductId?: string
    polarSyncedAt?: number
  }) => {
    const confirmed = window.confirm(
      `Delete package "${pkg.name}"? This only works if the package has never been assigned or purchased.`
    )
    if (!confirmed) return

    setDeletingPackageId(pkg._id)
    try {
      await deletePackage({
        adminUserId: adminUserId as never,
        packageId: pkg._id as never,
      })

      if (packageForm.packageId === pkg._id) {
        setPackageForm(emptyPackageForm)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete package")
    } finally {
      setDeletingPackageId(null)
    }
  }

  if (!overview) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading billing controls...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-bold text-foreground">Free User Credits</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the starting credit balance for free users. This amount is applied when a free user account is created.
        </p>

        <div className="mt-5 flex flex-col gap-3 md:max-w-sm">
          <div className="space-y-2">
            <FieldLabel htmlFor="initial-credits">Initial credits</FieldLabel>
            <Input
              id="initial-credits"
              type="number"
              min="0"
              value={initialCreditsDraft}
              onChange={(event) => setInitialCreditsDraft(event.target.value)}
            />
          </div>
          <Button onClick={handleSaveInitialCredits} disabled={savingInitialCredits}>
            {savingInitialCredits ? "Saving..." : "Save initial credits"}
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Package Builder</h3>
              <p className="text-sm text-muted-foreground">
                Admin controls the package name, slug, description, credits, price, and optional Polar product mapping.
              </p>
            </div>
            <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-right">
              <p className="text-xs uppercase text-muted-foreground">Customer price</p>
              <p className="text-lg font-semibold text-foreground">
                {formatMoneyFromCents(Number(packageForm.salePriceCents || 0))}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="package-name">Package Name</FieldLabel>
              <Input
                id="package-name"
                placeholder="Starter, Pro, Agency..."
                value={packageForm.name}
                onChange={(event) => setPackageForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-slug">Package Slug</FieldLabel>
              <Input
                id="package-slug"
                placeholder="starter-package"
                value={packageForm.slug}
                onChange={(event) => setPackageForm((current) => ({ ...current, slug: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-period">Time Period In Months</FieldLabel>
              <Input
                id="package-period"
                placeholder="1"
                type="number"
                min="1"
                value={packageForm.periodMonths}
                onChange={(event) => setPackageForm((current) => ({ ...current, periodMonths: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-credits">Credits Included</FieldLabel>
              <Input
                id="package-credits"
                placeholder="2500"
                type="number"
                value={packageForm.credits}
                onChange={(event) => setPackageForm((current) => ({ ...current, credits: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-sale-price">Customer Price In Cents</FieldLabel>
              <Input
                id="package-sale-price"
                placeholder="1999"
                type="number"
                value={packageForm.salePriceCents}
                onChange={(event) => setPackageForm((current) => ({ ...current, salePriceCents: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-polar-id">Polar Product ID</FieldLabel>
              <Input
                id="package-polar-id"
                placeholder="Optional Polar product ID"
                value={packageForm.polarProductId}
                onChange={(event) => setPackageForm((current) => ({ ...current, polarProductId: event.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <FieldLabel htmlFor="package-description">Package Description</FieldLabel>
            <textarea
              id="package-description"
              className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Short package description"
              value={packageForm.description}
              onChange={(event) => setPackageForm((current) => ({ ...current, description: event.target.value }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                checked={packageForm.isActive}
                onChange={(event) => setPackageForm((current) => ({ ...current, isActive: event.target.checked }))}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                checked={packageForm.isFeatured}
                onChange={(event) => setPackageForm((current) => ({ ...current, isFeatured: event.target.checked }))}
              />
              Featured on pricing page
            </label>
            <label className="flex items-center gap-2 text-muted-foreground">
              <input
                type="checkbox"
                checked={packageForm.autoSyncToPolar}
                onChange={(event) => setPackageForm((current) => ({ ...current, autoSyncToPolar: event.target.checked }))}
              />
              Auto-sync to Polar after save
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={handlePackageSubmit} disabled={savingPackage || !packageForm.name.trim()}>
              {savingPackage ? "Saving..." : packageForm.packageId ? "Update package" : "Create package"}
            </Button>
            {packageForm.packageId && (
              <Button variant="outline" onClick={() => setPackageForm(emptyPackageForm)}>
                Cancel edit
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl font-bold text-foreground">Manual Credit Grant</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add extra credits to any user by email. This is separate from purchased packages and lands in the wallet immediately.
          </p>

          <div className="mt-5 space-y-3">
            <div className="space-y-2">
              <FieldLabel htmlFor="manual-credit-email">User Email</FieldLabel>
              <select
                id="manual-credit-email"
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={manualCreditEmail}
                onChange={(event) => setManualCreditEmail(event.target.value)}
              >
                <option value="">Select user email</option>
                {overview.users.map((user) => (
                  <option key={user.id} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="manual-credit-amount">Credits To Add</FieldLabel>
              <Input
                id="manual-credit-amount"
                type="number"
                min="1"
                placeholder="500"
                value={manualCreditAmount}
                onChange={(event) => setManualCreditAmount(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="manual-credit-note">Grant Note</FieldLabel>
              <Input
                id="manual-credit-note"
                placeholder="Optional note"
                value={manualCreditNote}
                onChange={(event) => setManualCreditNote(event.target.value)}
              />
            </div>

            <Button onClick={handleGrantManualCredits} disabled={grantingManualCredits || !manualCreditEmail.trim() || !manualCreditAmount.trim()}>
              {grantingManualCredits ? "Granting..." : "Grant manual credits"}
            </Button>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground">Live Packages</h3>
          <p className="text-sm text-muted-foreground">
            These packages feed the landing-page pricing cards and the Polar checkout mapping.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePackages.map((pkg) => (
            <div
              key={pkg._id}
              className="flex min-h-[280px] flex-col rounded-xl border border-border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-base font-semibold text-foreground">{pkg.name}</h4>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {pkg.description || "No description yet."}
                  </p>
                </div>
                {pkg.isFeatured && (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Featured
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-3 rounded-lg border border-border/70 bg-card/40 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium text-foreground">{formatPackagePeriod(pkg.periodMonths)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-medium text-foreground">{pkg.credits}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-foreground">{formatMoneyFromCents(pkg.salePriceCents)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="max-w-[55%] truncate font-mono text-xs text-foreground">{pkg.slug}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Polar</span>
                  <span className="max-w-[55%] truncate text-right text-xs text-foreground">
                    {pkg.polarProductId || "Not linked"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Last sync</span>
                  <span className="max-w-[55%] text-right text-xs text-foreground">
                    {pkg.polarSyncedAt ? new Date(pkg.polarSyncedAt).toLocaleString() : "Never synced"}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setPackageForm({
                      packageId: pkg._id,
                      name: pkg.name,
                      slug: pkg.slug,
                      description: pkg.description || "",
                      periodMonths: String(pkg.periodMonths || 1),
                      credits: String(pkg.credits),
                      salePriceCents: String(pkg.salePriceCents),
                      polarProductId: pkg.polarProductId || "",
                      isActive: pkg.isActive,
                      isFeatured: pkg.isFeatured,
                      autoSyncToPolar: true,
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const result = await syncPackageToPolar(pkg._id)
                      alert(`Polar product ${result.mode}: ${result.productId}`)
                    } catch (error) {
                      alert(error instanceof Error ? error.message : "Failed to sync package to Polar")
                    }
                  }}
                  disabled={syncingPackageId === pkg._id}
                >
                  {syncingPackageId === pkg._id ? "Syncing..." : pkg.polarProductId ? "Resync Polar" : "Create Polar"}
                </Button>
                </div>
                <Button
                  variant="destructive"
                  className="mt-2 w-full"
                  onClick={() => handleDeletePackage(pkg)}
                  disabled={deletingPackageId === pkg._id}
                >
                  {deletingPackageId === pkg._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
