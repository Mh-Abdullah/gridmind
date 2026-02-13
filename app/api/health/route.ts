import { NextResponse } from "next/server";
import { convexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";

export async function GET() {
  try {
    // Try to run a simple query to verify Convex connection
    const userCount = await convexClient.query(api.users.countUsers, {});
    
    return NextResponse.json({
      status: "ok",
      message: "Convex connection successful",
      userCount,
    });
  } catch (error) {
    console.error("Health check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        message: "Convex connection failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
