import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "gridmind-default-secret-key-change-in-production";

console.log(`[Auth.ts] JWT_SECRET loaded: ${JWT_SECRET ? JWT_SECRET.substring(0, 30) + "..." : "NOT SET"}`);

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET not set in environment variables. Using default key. This is not secure for production!");
}

export function hashPassword(password: string): string {
  return bcryptjs.hashSync(password, 10);
}

export function comparePassword(password: string, hashedPassword: string): boolean {
  return bcryptjs.compareSync(password, hashedPassword);
}

export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const result = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
    console.log(`[VerifyToken] Successfully verified token`);
    return result;
  } catch (error) {
    console.log(`[VerifyToken] Error verifying token:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}
