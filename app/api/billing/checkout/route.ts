import { NextRequest, NextResponse } from "next/server"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { convexClient } from "@/lib/convex-server"
import { requireAuthenticatedUser } from "@/lib/server-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuthenticatedUser(request)
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const packageId = request.nextUrl.searchParams.get("packageId")
  if (!packageId) {
    return NextResponse.json({ error: "packageId is required" }, { status: 400 })
  }

  const pkg = await convexClient.query(api.billing.getPackageById, {
    packageId: packageId as Id<"billingPackages">,
  })

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  if (!pkg.polarProductId) {
    return NextResponse.json(
      { error: "This package is not connected to a Polar product yet." },
      { status: 400 }
    )
  }

  const checkoutUrl = new URL("/api/polar/checkout", request.url)
  checkoutUrl.searchParams.set("products", pkg.polarProductId)
  checkoutUrl.searchParams.set("customerExternalId", user.id)
  checkoutUrl.searchParams.set("customerEmail", user.email)
  checkoutUrl.searchParams.set("customerName", user.name || user.email)
  checkoutUrl.searchParams.set(
    "metadata",
    JSON.stringify({
      localPackageId: pkg._id,
      localPackageSlug: pkg.slug,
      userId: user.id,
    })
  )

  return NextResponse.redirect(checkoutUrl)
}
