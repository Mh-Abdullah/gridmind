import { NextRequest } from "next/server"

import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { convexClient } from "@/lib/convex-server"
import { requireAuthenticatedUser } from "@/lib/server-auth"

export async function chargeCreditsForAction(request: NextRequest, actionKey: string, note?: string) {
  const user = await requireAuthenticatedUser(request)
  if (!user) {
    throw new Error("Authentication required")
  }

  const charge = await convexClient.mutation(api.billing.consumeCredits, {
    userId: user.id,
    actionKey,
    note,
  })

  return { user, charge }
}

export async function refundCredits(userId: string, transactionId: string, note?: string) {
  return await convexClient.mutation(api.billing.refundCreditTransaction, {
    userId,
    transactionId: transactionId as Id<"creditTransactions">,
    note,
  })
}
