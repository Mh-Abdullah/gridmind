import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { query, mutation } from "./_generated/server";
import { FREE_TIER_CREDITS } from "../lib/access-policy";

async function getInitialCreditsSetting(ctx: MutationCtx | QueryCtx) {
  const settings = await ctx.db.query("billingSettings").first();
  return settings?.initialCredits ?? FREE_TIER_CREDITS;
}

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Create a new user (for registration)
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    password: v.string(), // Already hashed password
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password: args.password,
      role: args.role || "user",
      createdAt: now,
      updatedAt: now,
    });

    if ((args.role || "user") === "user") {
      const initialCredits = await getInitialCreditsSetting(ctx);
      await ctx.db.insert("creditAccounts", {
        userId,
        balanceCredits: initialCredits,
        totalPurchasedCredits: 0,
        totalAdminGrantedCredits: 0,
        totalSpentCredits: 0,
        updatedAt: now,
      });
    }

    return userId;
  },
});

// Get all users (for admin)
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    // Return users sorted by createdAt desc, without password
    return users
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: new Date(user.createdAt).toISOString(),
      }));
  },
});

// Count users (for health check)
export const countUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.length;
  },
});

// Update user
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete user
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

// Seed initial users (run once to create admin and test user)
// Note: Passwords should be pre-hashed using bcryptjs (10 rounds)
// admin password "1234" -> "$2a$10$..." (hash this in a separate script)
// test password "test1234" -> "$2a$10$..."
export const seedUsers = mutation({
  args: {
    adminPasswordHash: v.string(),
    testPasswordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "mh.abdulla.688@gmail.com"))
      .first();
    
    if (!existingAdmin) {
      await ctx.db.insert("users", {
        email: "mh.abdulla.688@gmail.com",
        name: "Admin",
        password: args.adminPasswordHash,
        role: "admin",
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Force-update password and role in case they were wrong
      await ctx.db.patch(existingAdmin._id, {
        password: args.adminPasswordHash,
        role: "admin",
        updatedAt: now,
      });
    }
    
    // Check if test user already exists
    const existingTest = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "test@example.com"))
      .first();
    
    if (!existingTest) {
      const testUserId = await ctx.db.insert("users", {
        email: "test@example.com",
        name: "Test User",
        password: args.testPasswordHash,
        role: "user",
        createdAt: now,
        updatedAt: now,
      });

      const initialCredits = await getInitialCreditsSetting(ctx);
      await ctx.db.insert("creditAccounts", {
        userId: testUserId,
        balanceCredits: initialCredits,
        totalPurchasedCredits: 0,
        totalAdminGrantedCredits: 0,
        totalSpentCredits: 0,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(existingTest._id, {
        password: args.testPasswordHash,
        updatedAt: now,
      });
    }
    
    return { success: true };
  },
});
