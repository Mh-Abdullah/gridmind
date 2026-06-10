import { NextRequest, NextResponse } from "next/server"

import type { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { convexClient } from "@/lib/convex-server"
import { syncPackageToPolar } from "@/lib/polar-products"
import { requireAuthenticatedUser } from "@/lib/server-auth"

export async function POST(request: NextRequest) {
  const user = await requireAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  try {
    const body = (await request.json()) as { packageId?: string }
    if (!body.packageId) {
      return NextResponse.json({ error: "packageId is required" }, { status: 400 })
    }

    const pkg = await convexClient.query(api.billing.getPackageById, {
      packageId: body.packageId as Id<"billingPackages">,
    })

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    const syncResult = await syncPackageToPolar({
      id: pkg._id,
      name: pkg.name,
      slug: pkg.slug,
      description: pkg.description,
      credits: pkg.credits,
      salePriceCents: pkg.salePriceCents,
      polarProductId: pkg.polarProductId,
      isActive: pkg.isActive,
    })

    await convexClient.mutation(api.billing.updatePackagePolarConnection, {
      adminUserId: user.id,
      packageId: pkg._id,
      polarProductId: syncResult.productId,
      polarSyncedAt: syncResult.syncedAt,
    })

    return NextResponse.json(syncResult)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync product to Polar"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
