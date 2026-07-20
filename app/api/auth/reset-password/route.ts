import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { convexClient } from "@/lib/convex-server";
import { hashPassword } from "@/lib/auth";
import { hashPasswordResetOtp, normalizeEmail } from "@/lib/password-reset";

const ResetSchema = z.object({
  email: z.string().trim().email().max(320),
  otp: z.string().regex(/^\d{6}$/),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  const parsed = ResetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter the six-digit code and a password of at least 8 characters." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const result = await convexClient.mutation(api.users.resetPasswordWithOtp, {
    email,
    codeHash: hashPasswordResetOtp(email, parsed.data.otp),
    password: hashPassword(parsed.data.password),
    now: Date.now(),
  });

  if (result.status !== "success") {
    return NextResponse.json(
      { error: "The verification code is invalid or has expired. Request a new code and try again." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Your password has been reset. You can now log in.",
  });
}

