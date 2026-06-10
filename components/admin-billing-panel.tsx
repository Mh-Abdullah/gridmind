"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { api } from "@/convex/_generated/api"
import { DEFAULT_BILLING_MARKUP } from "@/lib/billing-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PackageFormState = {
  packageId?: string
  name: string
  slug: string
  description: string
  credits: string
  internalCostCents: string
  markupMultiplier: string
  polarProductId: string
  isActive: boolean
  isFeatured: boolean
  autoSyncToPolar: boolean
}

const emptyPackageForm: PackageFormState = {
  name: "",
  slug: "",
  description: "",
  credits: "500",
  internalCostCents: "2",
  markupMultiplier: String(DEFAULT_BILLING_MARKUP),
  polarProductId: "",
  isActive: true,
  isFeatured: false,
  autoSyncToPolar: true,
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
  const assignPackage = useMutation(api.billing.assignPackageToUser)
  const upsertUsagePricing = useMutation(api.billing.upsertUsagePricing)

  const [packageForm, setPackageForm] = useState<PackageFormState>(emptyPackageForm)
  const [assignUserId, setAssignUserId] = useState("")
  const [assignPackageId, setAssignPackageId] = useState("")
  const [assignNote, setAssignNote] = useState("")
  const [pricingDrafts, setPricingDrafts] = useState<Record<string, { creditsCost: string; internalCostCents: string; markupMultiplier: string; isActive: boolean }>>({})
  const [savingPackage, setSavingPackage] = useState(false)
  const [syncingPackageId, setSyncingPackageId] = useState<string | null>(null)
  const [assigningPackage, setAssigningPackage] = useState(false)
  const [savingPricingKey, setSavingPricingKey] = useState<string | null>(null)

  useEffect(() => {
    if (!overview) return

    setPricingDrafts((current) => {
      const next = { ...current }
      for (const rule of overview.usagePricing) {
        next[rule.actionKey] = {
          creditsCost: String(rule.creditsCost),
          internalCostCents: String(rule.internalCostCents),
          markupMultiplier: String(rule.markupMultiplier),
          isActive: rule.isActive,
        }
      }
      return next
    })

    if (!assignUserId && overview.users.length > 0) {
      setAssignUserId(overview.users[0].id)
    }

    if (!assignPackageId && overview.packages.length > 0) {
      setAssignPackageId(overview.packages[0]._id)
    }
  }, [overview, assignPackageId, assignUserId])

  const computedSalePriceCents = Math.round(
    Number(packageForm.internalCostCents || 0) * Number(packageForm.markupMultiplier || DEFAULT_BILLING_MARKUP)
  )

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
        credits: Number(packageForm.credits),
        internalCostCents: Number(packageForm.internalCostCents),
        markupMultiplier: Number(packageForm.markupMultiplier),
        polarProductId: packageForm.polarProductId || undefined,
        polarSyncedAt: undefined,
        isActive: packageForm.isActive,
        isFeatured: packageForm.isFeatured,
      })

      if (packageForm.autoSyncToPolar) {
        await syncPackageToPolar(String(packageId))
      }

      setPackageForm(emptyPackageForm)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save package")
    } finally {
      setSavingPackage(false)
    }
  }

  const handleAssignPackage = async () => {
    if (!assignUserId || !assignPackageId) return
    setAssigningPackage(true)
    try {
      await assignPackage({
        adminUserId: adminUserId as never,
        userId: assignUserId as never,
        packageId: assignPackageId as never,
        note: assignNote || undefined,
      })
      setAssignNote("")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to assign package")
    } finally {
      setAssigningPackage(false)
    }
  }

  const handleSavePricing = async (actionKey: string, label: string) => {
    const draft = pricingDrafts[actionKey]
    if (!draft) return

    setSavingPricingKey(actionKey)
    try {
      await upsertUsagePricing({
        adminUserId: adminUserId as never,
        actionKey,
        label,
        creditsCost: Number(draft.creditsCost),
        internalCostCents: Number(draft.internalCostCents),
        markupMultiplier: Number(draft.markupMultiplier),
        isActive: draft.isActive,
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save usage pricing")
    } finally {
      setSavingPricingKey(null)
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
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Package Builder</h3>
              <p className="text-sm text-muted-foreground">
                Admin controls credits, internal cost, 2x markup, and optional Polar product mapping.
              </p>
            </div>
            <div className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-right">
              <p className="text-xs uppercase text-muted-foreground">Customer price</p>
              <p className="text-lg font-semibold text-foreground">{formatMoneyFromCents(computedSalePriceCents)}</p>
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
              <FieldLabel htmlFor="package-credits">Credits Included</FieldLabel>
              <Input
                id="package-credits"
                placeholder="500"
                type="number"
                value={packageForm.credits}
                onChange={(event) => setPackageForm((current) => ({ ...current, credits: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-internal-cost">Internal Cost In Cents</FieldLabel>
              <Input
                id="package-internal-cost"
                placeholder="2"
                type="number"
                value={packageForm.internalCostCents}
                onChange={(event) => setPackageForm((current) => ({ ...current, internalCostCents: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="package-markup">Markup Multiplier</FieldLabel>
              <Input
                id="package-markup"
                placeholder="2"
                type="number"
                step="0.1"
                value={packageForm.markupMultiplier}
                onChange={(event) => setPackageForm((current) => ({ ...current, markupMultiplier: event.target.value }))}
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
          <h3 className="text-xl font-bold text-foreground">Assign Package</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Grant a package manually to any user. Credits land in the user balance immediately.
          </p>

          <div className="mt-5 space-y-3">
            <div className="space-y-2">
              <FieldLabel htmlFor="assign-user">Select User</FieldLabel>
              <select
                id="assign-user"
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={assignUserId}
                onChange={(event) => setAssignUserId(event.target.value)}
              >
                {overview.users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {(user.name || user.email) + ` - ${user.balanceCredits} credits`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="assign-package">Select Package</FieldLabel>
              <select
                id="assign-package"
                className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={assignPackageId}
                onChange={(event) => setAssignPackageId(event.target.value)}
              >
                {overview.packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name} - {pkg.credits} credits
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="assign-note">Assignment Note</FieldLabel>
              <Input
                id="assign-note"
                placeholder="Optional note"
                value={assignNote}
                onChange={(event) => setAssignNote(event.target.value)}
              />
            </div>

            <Button onClick={handleAssignPackage} disabled={assigningPackage || !assignUserId || !assignPackageId}>
              {assigningPackage ? "Assigning..." : "Assign package"}
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
          {overview.packages.map((pkg) => (
            <div key={pkg._id} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                  <p className="text-sm text-muted-foreground">{pkg.description || "No description yet."}</p>
                </div>
                {pkg.isFeatured && (
                  <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">
                    Featured
                  </span>
                )}
              </div>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>{pkg.credits} credits</p>
                <p>Internal cost: {formatMoneyFromCents(pkg.internalCostCents)}</p>
                <p>Customer price: {formatMoneyFromCents(pkg.salePriceCents)}</p>
                <p>Markup: {pkg.markupMultiplier.toFixed(1)}x</p>
                <p>{pkg.polarProductId ? `Polar: ${pkg.polarProductId}` : "Polar product not linked"}</p>
                <p>{pkg.polarSyncedAt ? `Synced: ${new Date(pkg.polarSyncedAt).toLocaleString()}` : "Never synced to Polar"}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setPackageForm({
                      packageId: pkg._id,
                      name: pkg.name,
                      slug: pkg.slug,
                      description: pkg.description || "",
                      credits: String(pkg.credits),
                      internalCostCents: String(pkg.internalCostCents),
                      markupMultiplier: String(pkg.markupMultiplier),
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
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground">Usage Pricing Rules</h3>
          <p className="text-sm text-muted-foreground">
            This is where your runtime credit burn happens. If your system spends 2 cents, keep markup at 2 and users get charged 4 cents worth of credits.
          </p>
        </div>

        <div className="space-y-4">
          {overview.usagePricing.map((rule) => {
            const draft = pricingDrafts[rule.actionKey]
            if (!draft) return null

            const liveCustomerCents = Math.round(Number(draft.internalCostCents || 0) * Number(draft.markupMultiplier || 1))

            return (
              <div key={rule.actionKey} className="grid gap-4 rounded-lg border border-border bg-background p-4 lg:grid-cols-[1.2fr_repeat(3,0.7fr)_auto_auto]">
                <div>
                  <p className="font-medium text-foreground">{rule.label}</p>
                  <p className="text-xs text-muted-foreground">{rule.actionKey}</p>
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor={`${rule.actionKey}-credits`}>Credits Cost</FieldLabel>
                  <Input
                    id={`${rule.actionKey}-credits`}
                    type="number"
                    value={draft.creditsCost}
                    onChange={(event) =>
                      setPricingDrafts((current) => ({
                        ...current,
                        [rule.actionKey]: { ...current[rule.actionKey], creditsCost: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor={`${rule.actionKey}-internal`}>Internal Cost</FieldLabel>
                  <Input
                    id={`${rule.actionKey}-internal`}
                    type="number"
                    value={draft.internalCostCents}
                    onChange={(event) =>
                      setPricingDrafts((current) => ({
                        ...current,
                        [rule.actionKey]: { ...current[rule.actionKey], internalCostCents: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel htmlFor={`${rule.actionKey}-markup`}>Markup</FieldLabel>
                  <Input
                    id={`${rule.actionKey}-markup`}
                    type="number"
                    step="0.1"
                    value={draft.markupMultiplier}
                    onChange={(event) =>
                      setPricingDrafts((current) => ({
                        ...current,
                        [rule.actionKey]: { ...current[rule.actionKey], markupMultiplier: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {formatMoneyFromCents(liveCustomerCents)}
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(event) =>
                      setPricingDrafts((current) => ({
                        ...current,
                        [rule.actionKey]: { ...current[rule.actionKey], isActive: event.target.checked },
                      }))
                    }
                  />
                  Active
                </label>
                <Button
                  variant="outline"
                  onClick={() => handleSavePricing(rule.actionKey, rule.label)}
                  disabled={savingPricingKey === rule.actionKey}
                >
                  {savingPricingKey === rule.actionKey ? "Saving..." : "Save"}
                </Button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
