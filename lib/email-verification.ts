import { createHmac, randomInt } from "node:crypto";

export const EMAIL_VERIFICATION_EXPIRY_MS = 10 * 60 * 1000;

export function generateEmailVerificationOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashEmailVerificationOtp(email: string, otp: string): string {
  const secret =
    process.env.EMAIL_VERIFICATION_SECRET ||
    process.env.PASSWORD_RESET_SECRET ||
    process.env.JWT_SECRET ||
    "gridmind-email-verification-development-secret";

  return createHmac("sha256", secret)
    .update(`registration:${email.trim().toLowerCase()}:${otp}`)
    .digest("hex");
}

