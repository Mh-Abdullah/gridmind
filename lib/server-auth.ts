import { NextRequest } from "next/server"

import { convexClient } from "@/lib/convex-server"
import { verifyToken } from "@/lib/auth"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export type AuthenticatedUser = {
  id: string
  email: string
  name?: string
  role: string
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token =
    request.cookies.get("auth_token")?.value ??
    request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  const user = await convexClient.query(api.users.getUserById, {
    userId: decoded.userId as Id<"users">,
  })

  if (!user) {
    return null
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export async function requireAuthenticatedUser(request: NextRequest) {
  return getAuthenticatedUser(request)
}
