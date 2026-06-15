import { Polar } from "@polar-sh/sdk"
import { NextRequest, NextResponse } from "next/server"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { convexClient } from "@/lib/convex-server"
import { getPolarServerMode } from "@/lib/polar"
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

  const purchaseStatus = await convexClient.query(api.billing.getUserPackagePurchaseStatus, {
    userId: user.id,
    packageId: packageId as Id<"billingPackages">,
  })

  if (purchaseStatus.isLocked) {
    const billingUrl = new URL("/billing", request.url)
    billingUrl.searchParams.set("checkoutError", "package-active")
    return NextResponse.redirect(billingUrl)
  }

  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ error: "Polar access token is not configured." }, { status: 500 })
  }

  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: getPolarServerMode(),
  })

  const billingUrl = new URL("/billing", request.url)
  const successUrl = new URL(billingUrl.toString())
  successUrl.searchParams.set("checkout", "success")
  successUrl.searchParams.set("packageId", pkg._id)
  successUrl.searchParams.set("checkout_id", "{CHECKOUT_ID}")

  try {
    const checkout = await polar.checkouts.create({
      products: [pkg.polarProductId],
      externalCustomerId: user.id,
      customerEmail: user.email,
      customerName: user.name || user.email,
      customerBillingName: user.name || user.email,
      requireBillingAddress: true,
      successUrl: successUrl.toString(),
      returnUrl: billingUrl.toString(),
      metadata: {
        localPackageId: pkg._id,
        localPackageSlug: pkg.slug,
        userId: user.id,
      },
    })

    return NextResponse.redirect(checkout.url)
  } catch (error) {
    console.error("[Billing checkout] Failed to create Polar checkout", error)
    return NextResponse.json({ error: "Unable to start checkout right now." }, { status: 500 })
  }
}
