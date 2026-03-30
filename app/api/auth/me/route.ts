import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { verifyToken } from "@/lib/auth";
import { Id } from "@/convex/_generated/dataModel";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get("auth_token")?.value || 
                  request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify and decode token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Fetch fresh user data from database
    const user = await convexClient.query(api.users.getUserById, { 
      userId: decoded.userId as Id<"users">
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
