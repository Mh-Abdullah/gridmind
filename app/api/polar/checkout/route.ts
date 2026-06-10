import { Checkout } from "@polar-sh/nextjs"

import { getPolarServerMode } from "@/lib/polar"

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: process.env.POLAR_SUCCESS_URL || process.env.NEXT_PUBLIC_APP_URL,
  returnUrl: process.env.POLAR_RETURN_URL || process.env.NEXT_PUBLIC_APP_URL,
  server: getPolarServerMode(),
  theme: "light",
})
