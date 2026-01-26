import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try to run a simple query to verify database connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      userCount,
    });
  } catch (error) {
    console.error("Health check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
