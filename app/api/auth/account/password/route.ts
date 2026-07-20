import { NextRequest, NextResponse } from "next/server"

import { api } from "@/convex/_generated/api"
import { comparePassword, hashPassword } from "@/lib/auth"
import { convexClient } from "@/lib/convex-server"
import { getAuthenticatedUser } from "@/lib/server-auth"

export async function PATCH(request: NextRequest) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request)

    if (!authenticatedUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : ""
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : ""

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    const userRecord = await convexClient.query(api.users.getUserById, {
      userId: authenticatedUser.id as never,
    })

    if (!userRecord || !comparePassword(currentPassword, userRecord.password)) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    if (comparePassword(newPassword, userRecord.password)) {
      return NextResponse.json(
        { error: "New password must be different from the current password" },
        { status: 400 }
      )
    }

    await convexClient.mutation(api.users.updatePassword, {
      userId: authenticatedUser.id as never,
      password: hashPassword(newPassword),
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
