import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { convexClient } from "@/lib/convex-server";
import {
  generatePasswordResetOtp,
  hashPasswordResetOtp,
  normalizeEmail,
  PASSWORD_RESET_EXPIRY_MS,
} from "@/lib/password-reset";

const RequestSchema = z.object({
  email: z.string().trim().email().max(320),
});

const GENERIC_MESSAGE =
  "If a user account exists for that email, a verification code has been sent.";

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const configuredFrom = process.env.EMAIL_FROM;

  if (!apiKey || !configuredFrom) {
    return NextResponse.json(
      { error: "Password recovery email is not configured." },
      { status: 503 }
    );
  }

  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const otp = generatePasswordResetOtp();
  const now = Date.now();
  const result = await convexClient.mutation(api.users.createPasswordResetOtp, {
    email,
    codeHash: hashPasswordResetOtp(email, otp),
    expiresAt: now + PASSWORD_RESET_EXPIRY_MS,
    now,
  });

  if (result.status === "ineligible") {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  if (result.status === "rate_limited") {
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  try {
    const providerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: configuredFrom,
        to: [email],
        subject: "Your GridMind password reset code",
        text: [
          "We received a request to reset your GridMind password.",
          "",
          `Your verification code is: ${otp}`,
          "",
          "This code expires in 2 minutes. If you did not request this, you can ignore this email.",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!providerResponse.ok) {
      const providerError = await providerResponse.text().catch(() => "");
      console.error("[password-reset] Resend rejected email:", providerResponse.status, providerError);
      throw new Error(`Email provider returned HTTP ${providerResponse.status}`);
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    await convexClient.mutation(api.users.cancelPasswordResetOtp, {
      resetId: result.resetId,
      now: Date.now(),
    });
    console.error("[password-reset] Failed to send OTP:", error);
    return NextResponse.json(
      { error: "We could not send the verification code. Please try again." },
      { status: 502 }
    );
  }
}
