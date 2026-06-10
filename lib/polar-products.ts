import { Polar } from "@polar-sh/sdk"

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
  return {
    name: pkg.name,
    description: pkg.description || `${pkg.credits} credits package for GridMind`,
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
    metadata: {
      localPackageId: pkg.id,
      localPackageSlug: pkg.slug,
      credits: pkg.credits,
    },
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
