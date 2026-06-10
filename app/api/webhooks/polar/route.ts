import { Webhooks } from "@polar-sh/nextjs"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { convexClient } from "@/lib/convex-server"

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "",
  onOrderPaid: async (payload) => {
    const localPackageId = payload.data.metadata.localPackageId
    const externalUserId = payload.data.customer.externalId
    const polarCustomerId = payload.data.customer.id

    if (!externalUserId) {
      console.warn("[Polar webhook] Missing external user id on paid order", payload.data.id)
      return
    }

    let packageRecord =
      localPackageId
        ? await convexClient.query(api.billing.getPackageById, {
            packageId: String(localPackageId) as Id<"billingPackages">,
          })
        : null

    if (!packageRecord && payload.data.productId) {
      packageRecord = await convexClient.query(api.billing.findPackageByPolarProductId, {
        polarProductId: payload.data.productId,
      })
    }

    if (!packageRecord) {
      console.warn("[Polar webhook] No local package mapping found for paid order", payload.data.id)
      return
    }

    await convexClient.mutation(api.billing.grantCreditsFromPolarOrder, {
      userId: externalUserId,
      packageId: packageRecord._id,
      polarOrderId: payload.data.id,
      polarCustomerId,
    })
  },
})
