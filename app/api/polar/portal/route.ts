import { CustomerPortal } from "@polar-sh/nextjs"

import { getPolarServerMode } from "@/lib/polar"
import { getAuthenticatedUser } from "@/lib/server-auth"

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: getPolarServerMode(),
  returnUrl: process.env.POLAR_RETURN_URL || process.env.NEXT_PUBLIC_APP_URL,
  getExternalCustomerId: async (request) => {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      throw new Error("Authentication required")
    }
    return user.id
  },
})
