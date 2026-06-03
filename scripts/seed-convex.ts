// Seed script for Convex - Run this once to create initial users
// Usage: npx tsx scripts/seed-convex.ts

import { config } from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import bcryptjs from "bcryptjs";

// Load environment variables from .env file
config();

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL environment variable is not set");
  console.log("Please set it in your .env file");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Seeding Convex database...\n");

  const client = new ConvexHttpClient(convexUrl!);

  // Hash passwords
  const adminPasswordHash = bcryptjs.hashSync("1234", 10);
  const testPasswordHash = bcryptjs.hashSync("test1234", 10); // kept for mutation signature

  console.log("Creating admin user: mh.abdulla.688@gmail.com (password: 1234)\n");

  try {
    // Import the api properly for runtime
    const { api } = await import("../convex/_generated/api");
    
    await client.mutation(api.users.seedUsers, {
      adminPasswordHash,
      testPasswordHash,
    });

    console.log("✅ Seed completed successfully!");
    console.log("\n📋 Admin user:");
    console.log("  - Admin: mh.abdulla.688@gmail.com / 1234");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
