import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasConvexUrl: !!process.env.NEXT_PUBLIC_CONVEX_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    convexUrlLength: process.env.NEXT_PUBLIC_CONVEX_URL?.length || 0,
    jwtSecretLength: process.env.JWT_SECRET?.length || 0,
  });
}
