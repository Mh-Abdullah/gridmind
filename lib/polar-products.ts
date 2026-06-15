import { Polar } from "@polar-sh/sdk"
import { formatPackagePeriod, parsePackageDescription } from "@/lib/package-period"

type BillingPackageForPolar = {
  id: string
  name: string
  slug: string
  description?: string
  credits: number
  salePriceCents: number
  polarProductId?: string
  isActive: boolean
}

function getPolarClient() {
  const accessToken = process.env.POLAR_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not configured")
  }

  return new Polar({
    accessToken,
    server: process.env.POLAR_MODE === "production" ? "production" : "sandbox",
  })
}

function buildProductPayload(pkg: BillingPackageForPolar) {
  const parsed = parsePackageDescription(pkg.description)
  const metadata: Record<string, string | number | boolean> = {
    localPackageId: pkg.id,
    localPackageSlug: pkg.slug,
    credits: pkg.credits,
  }

  if (parsed.periodMonths) {
    metadata.periodMonths = parsed.periodMonths
  }

  return {
    name: pkg.name,
    description:
      parsed.description ||
      `${pkg.credits} credits package for GridMind, valid for ${formatPackagePeriod(parsed.periodMonths).toLowerCase()}`,
    visibility: pkg.isActive ? "public" : "private",
    recurringInterval: null,
    recurringIntervalCount: null,
    prices: [
      {
        amountType: "fixed" as const,
        priceAmount: pkg.salePriceCents,
        priceCurrency: "usd" as const,
      },
    ],
    metadata,
  }
}

export async function syncPackageToPolar(pkg: BillingPackageForPolar) {
  const polar = getPolarClient()
  const payload = buildProductPayload(pkg)

  if (!pkg.polarProductId) {
    const created = await polar.products.create(payload)
    return {
      productId: created.id,
      syncedAt: Date.now(),
      mode: "created" as const,
    }
  }

  await polar.products.update({
    id: pkg.polarProductId,
    productUpdate: payload,
  })

  return {
    productId: pkg.polarProductId,
    syncedAt: Date.now(),
    mode: "updated" as const,
  }
}
