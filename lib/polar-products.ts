import { Polar } from "@polar-sh/sdk"
import { formatPackagePeriod, parsePackageDescription } from "@/lib/package-period"
import { getPolarServerMode } from "@/lib/polar"

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
    server: getPolarServerMode(),
  })
}

function buildProductPayload(pkg: BillingPackageForPolar) {
  const parsed = parsePackageDescription(pkg.description)
  const visibility: "public" | "private" = pkg.isActive ? "public" : "private"
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
    visibility,
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

function isPolarResourceNotFound(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }

  const candidate = error as {
    status?: number
    statusCode?: number
    message?: string
    body$?: string
  }

  return (
    candidate.status === 404 ||
    candidate.statusCode === 404 ||
    candidate.message?.includes("ResourceNotFound") === true ||
    candidate.body$?.includes("ResourceNotFound") === true
  )
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

  try {
    await polar.products.update({
      id: pkg.polarProductId,
      productUpdate: payload,
    })
  } catch (error) {
    // Sandbox and production have separate product IDs. When a package still
    // references its sandbox product after switching to production, recreate
    // it in the active Polar environment and let the caller persist the new ID.
    if (!isPolarResourceNotFound(error)) {
      throw error
    }

    const created = await polar.products.create(payload)
    return {
      productId: created.id,
      syncedAt: Date.now(),
      mode: "created" as const,
    }
  }

  return {
    productId: pkg.polarProductId,
    syncedAt: Date.now(),
    mode: "updated" as const,
  }
}
