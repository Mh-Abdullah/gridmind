import { NextRequest, NextResponse } from "next/server";
import { convexClient } from "@/lib/convex-server";
import { api } from "@/convex/_generated/api";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await convexClient.query(api.users.getUserByEmail, { email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create new user with hashed password
    const hashedPassword = hashPassword(password);
    const userId = await convexClient.mutation(api.users.createUser, {
      email,
      name,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: userId,
          email,
          name,
          role: "user",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
