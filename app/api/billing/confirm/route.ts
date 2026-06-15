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
    return NextResponse.json({ error: "Authentication required." }, { status: 401 })
  }

  const checkoutId = request.nextUrl.searchParams.get("checkoutId")
  const packageId = request.nextUrl.searchParams.get("packageId")

  if (!checkoutId || !packageId) {
    return NextResponse.json({ error: "checkoutId and packageId are required." }, { status: 400 })
  }

  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ error: "Polar access token is not configured." }, { status: 500 })
  }

  const pkg = await convexClient.query(api.billing.getPackageById, {
    packageId: packageId as Id<"billingPackages">,
  })

  if (!pkg) {
    return NextResponse.json({ error: "Package not found." }, { status: 404 })
  }

  try {
    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server: getPolarServerMode(),
    })

    const checkout = await polar.checkouts.get({ id: checkoutId })
    if (checkout.externalCustomerId && checkout.externalCustomerId !== user.id) {
      return NextResponse.json({ error: "Checkout does not belong to this user." }, { status: 403 })
    }

    const orders = await polar.orders.list({
      checkoutId,
      externalCustomerId: user.id,
      limit: 10,
    })

    const paidOrder = orders.result.items.find((order) => order.paid || order.status === "paid")
    if (!paidOrder) {
      return NextResponse.json({
        status: checkout.status === "succeeded" ? "processing" : checkout.status,
        granted: false,
      })
    }

    const result = await convexClient.mutation(api.billing.grantCreditsFromPolarOrder, {
      userId: user.id,
      packageId: pkg._id,
      polarOrderId: paidOrder.id,
      polarCustomerId: paidOrder.customer.id,
    })

    return NextResponse.json({
      status: "paid",
      granted: true,
      alreadyProcessed: result.alreadyProcessed,
      balanceCredits: result.balanceCredits ?? null,
    })
  } catch (error) {
    console.error("[Billing confirm] Failed to confirm Polar checkout", { checkoutId, packageId, error })
    return NextResponse.json({ error: "Unable to confirm checkout right now." }, { status: 500 })
  }
}
