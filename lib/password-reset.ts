import { createHmac, randomInt } from "node:crypto";

const OTP_LENGTH = 6;

export const PASSWORD_RESET_EXPIRY_MS = 10 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function generatePasswordResetOtp(): string {
  return randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
}

export function hashPasswordResetOtp(email: string, otp: string): string {
  const secret =
    process.env.PASSWORD_RESET_SECRET ||
    process.env.JWT_SECRET ||
    "gridmind-password-reset-development-secret";

  return createHmac("sha256", secret)
    .update(`${normalizeEmail(email)}:${otp}`)
    .digest("hex");
}

