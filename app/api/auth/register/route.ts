import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { api } from "@/convex/_generated/api";
import { hashPassword } from "@/lib/auth";
import { convexClient } from "@/lib/convex-server";
import {
  EMAIL_VERIFICATION_EXPIRY_MS,
  generateEmailVerificationOtp,
  hashEmailVerificationOtp,
} from "@/lib/email-verification";
import { normalizeEmail } from "@/lib/password-reset";

const RequestCodeSchema = z.object({
  action: z.literal("request"),
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(2).max(100),
  password: z.string().min(8).max(128),
});

const VerifyCodeSchema = z.object({
  action: z.literal("verify"),
  email: z.string().trim().email().max(320),
  otp: z.string().regex(/^\d{6}$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body?.action === "verify") {
      const parsed = VerifyCodeSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Enter a valid six-digit verification code." }, { status: 400 });
      }

      const email = normalizeEmail(parsed.data.email);
      const result = await convexClient.mutation(api.users.completePendingRegistration, {
        email,
        codeHash: hashEmailVerificationOtp(email, parsed.data.otp),
        now: Date.now(),
      });

      if (result.status === "exists") {
        return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
      }
      if (result.status !== "success") {
        return NextResponse.json(
          { error: "The verification code is invalid or expired. Request a new code and try again." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Email verified and account created successfully." },
        { status: 201 }
      );
    }

    const parsed = RequestCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email, a name of at least 2 characters, and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const configuredFrom = process.env.EMAIL_FROM;
    if (!apiKey || !configuredFrom) {
      return NextResponse.json({ error: "Signup email verification is not configured." }, { status: 503 });
    }

    const email = normalizeEmail(parsed.data.email);
    const otp = generateEmailVerificationOtp();
    const now = Date.now();
    const result = await convexClient.mutation(api.users.createPendingRegistration, {
      email,
      name: parsed.data.name,
      password: hashPassword(parsed.data.password),
      codeHash: hashEmailVerificationOtp(email, otp),
      expiresAt: now + EMAIL_VERIFICATION_EXPIRY_MS,
      now,
    });

    if (result.status === "exists") {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }
    if (result.status === "rate_limited") {
      return NextResponse.json(
        { error: "Please wait one minute before requesting another verification code." },
        { status: 429 }
      );
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
          subject: "Verify your GridMind email",
          text: [
            "Use this verification code to finish creating your GridMind account:",
            "",
            otp,
            "",
            "This code expires in 10 minutes. If you did not start this signup, you can ignore this email.",
          ].join("\n"),
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!providerResponse.ok) {
        const providerError = await providerResponse.text().catch(() => "");
        console.error("[registration] Resend rejected email:", providerResponse.status, providerError);
        throw new Error(`Email provider returned HTTP ${providerResponse.status}`);
      }

      return NextResponse.json({
        message: "A six-digit verification code was sent to your email.",
      });
    } catch (error) {
      await convexClient.mutation(api.users.cancelPendingRegistration, {
        registrationId: result.registrationId,
        now: Date.now(),
      });
      console.error("[registration] Failed to send verification email:", error);
      return NextResponse.json(
        { error: "We could not deliver a verification code to that email. Check the address and try again." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
