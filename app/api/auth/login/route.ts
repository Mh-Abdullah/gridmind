import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { comparePassword, generateToken } from "@/lib/auth";
import { normalizeEmail } from "@/lib/password-reset";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = LoginSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid registered email and password." },
        { status: 400 }
      );
    }
    const email = normalizeEmail(parsed.data.email);
    const { password } = parsed.data;

    // Find user in Convex
    const user = await convexClient.query(api.users.getUserByEmail, { email });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.role === "user" && password.length < 8) {
      return NextResponse.json(
        { error: "User passwords must contain at least 8 characters. Use Forgot password to set a new password." },
        { status: 400 }
      );
    }

    // Compare password
    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    console.log(`[Login API] Generated token: ${token.substring(0, 50)}...`);
    console.log(`[Login API] JWT_SECRET from env: ${process.env.JWT_SECRET ? "Set" : "Not set"}`);

    // Create response with token in httpOnly cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: false, // Allow HTTP in development
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/", // Ensure cookie is available for all paths
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
