import { NextRequest, NextResponse } from "next/server"

import { api } from "@/convex/_generated/api"
import { comparePassword } from "@/lib/auth"
import { convexClient } from "@/lib/convex-server"
import { getAuthenticatedUser } from "@/lib/server-auth"

export async function PATCH(request: NextRequest) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request)

    if (!authenticatedUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""

    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters long" }, { status: 400 })
    }

    if (name.length > 80) {
      return NextResponse.json({ error: "Name must be 80 characters or less" }, { status: 400 })
    }

    await convexClient.mutation(api.users.updateProfile, {
      userId: authenticatedUser.id as never,
      name,
    })

    return NextResponse.json({
      message: "Account name updated successfully",
      user: {
        ...authenticatedUser,
        name,
      },
    })
  } catch (error) {
    console.error("Account update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request)

    if (!authenticatedUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (authenticatedUser.role === "admin") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted from account settings" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : ""
    const confirmation = typeof body.confirmation === "string" ? body.confirmation.trim() : ""

    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 })
    }

    if (confirmation !== authenticatedUser.email) {
      return NextResponse.json({ error: "Type your email address to confirm deletion" }, { status: 400 })
    }

    const userRecord = await convexClient.query(api.users.getUserById, {
      userId: authenticatedUser.id as never,
    })

    if (!userRecord || !comparePassword(currentPassword, userRecord.password)) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    await convexClient.mutation(api.users.deleteAccountCascade, {
      userId: authenticatedUser.id as never,
    })

    const response = NextResponse.json({ message: "Account deleted successfully" })
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
