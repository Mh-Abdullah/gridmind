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
    emailVerifiedAt: v.optional(v.number()),
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
      emailVerifiedAt: args.emailVerifiedAt,
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

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const updatePassword = mutation({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      password: args.password,
      updatedAt: Date.now(),
    });
  },
});

export const createPasswordResetOtp = mutation({
  args: {
    email: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || user.role !== "user") {
      return { status: "ineligible" as const };
    }

    const existing = await ctx.db
      .query("passwordResetOtps")
      .withIndex("by_email_createdAt", (q) => q.eq("email", args.email))
      .order("desc")
      .collect();
    const latest = existing[0];

    if (latest && !latest.consumedAt && args.now - latest.createdAt < 60_000) {
      return {
        status: "rate_limited" as const,
        retryAfterSeconds: Math.max(1, Math.ceil((60_000 - (args.now - latest.createdAt)) / 1000)),
      };
    }

    for (const reset of existing) {
      if (!reset.consumedAt) {
        await ctx.db.patch(reset._id, { consumedAt: args.now });
      }
      if (reset.createdAt < args.now - 24 * 60 * 60 * 1000) {
        await ctx.db.delete(reset._id);
      }
    }

    const resetId = await ctx.db.insert("passwordResetOtps", {
      email: args.email,
      codeHash: args.codeHash,
      expiresAt: args.expiresAt,
      attempts: 0,
      createdAt: args.now,
    });

    return { status: "created" as const, resetId };
  },
});

export const cancelPasswordResetOtp = mutation({
  args: {
    resetId: v.id("passwordResetOtps"),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const reset = await ctx.db.get(args.resetId);
    if (reset && !reset.consumedAt) {
      await ctx.db.patch(args.resetId, { consumedAt: args.now });
    }
  },
});

export const resetPasswordWithOtp = mutation({
  args: {
    email: v.string(),
    codeHash: v.string(),
    password: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const reset = await ctx.db
      .query("passwordResetOtps")
      .withIndex("by_email_createdAt", (q) => q.eq("email", args.email))
      .order("desc")
      .first();

    if (
      !reset ||
      reset.consumedAt ||
      reset.expiresAt < args.now ||
      reset.attempts >= 5
    ) {
      return { status: "invalid" as const };
    }

    if (reset.codeHash !== args.codeHash) {
      await ctx.db.patch(reset._id, {
        attempts: reset.attempts + 1,
        ...(reset.attempts + 1 >= 5 ? { consumedAt: args.now } : {}),
      });
      return { status: "invalid" as const };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || user.role !== "user") {
      await ctx.db.patch(reset._id, { consumedAt: args.now });
      return { status: "invalid" as const };
    }

    await ctx.db.patch(user._id, {
      password: args.password,
      updatedAt: args.now,
    });
    await ctx.db.patch(reset._id, { consumedAt: args.now });

    return { status: "success" as const };
  },
});

export const createPendingRegistration = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existingUser) {
      return { status: "exists" as const };
    }

    const existing = await ctx.db
      .query("pendingRegistrations")
      .withIndex("by_email_createdAt", (q) => q.eq("email", args.email))
      .order("desc")
      .collect();
    const latest = existing[0];

    if (latest && !latest.consumedAt && args.now - latest.createdAt < 60_000) {
      return { status: "rate_limited" as const };
    }

    for (const registration of existing) {
      if (!registration.consumedAt) {
        await ctx.db.patch(registration._id, { consumedAt: args.now });
      }
      if (registration.createdAt < args.now - 24 * 60 * 60 * 1000) {
        await ctx.db.delete(registration._id);
      }
    }

    const registrationId = await ctx.db.insert("pendingRegistrations", {
      email: args.email,
      name: args.name,
      password: args.password,
      codeHash: args.codeHash,
      expiresAt: args.expiresAt,
      attempts: 0,
      createdAt: args.now,
    });

    return { status: "created" as const, registrationId };
  },
});

export const cancelPendingRegistration = mutation({
  args: {
    registrationId: v.id("pendingRegistrations"),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);
    if (registration && !registration.consumedAt) {
      await ctx.db.patch(args.registrationId, { consumedAt: args.now });
    }
  },
});

export const completePendingRegistration = mutation({
  args: {
    email: v.string(),
    codeHash: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("pendingRegistrations")
      .withIndex("by_email_createdAt", (q) => q.eq("email", args.email))
      .order("desc")
      .first();

    if (
      !registration ||
      registration.consumedAt ||
      registration.expiresAt < args.now ||
      registration.attempts >= 5
    ) {
      return { status: "invalid" as const };
    }

    if (registration.codeHash !== args.codeHash) {
      await ctx.db.patch(registration._id, {
        attempts: registration.attempts + 1,
        ...(registration.attempts + 1 >= 5 ? { consumedAt: args.now } : {}),
      });
      return { status: "invalid" as const };
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existingUser) {
      await ctx.db.patch(registration._id, { consumedAt: args.now });
      return { status: "exists" as const };
    }

    const userId = await ctx.db.insert("users", {
      email: registration.email,
      name: registration.name,
      password: registration.password,
      role: "user",
      emailVerifiedAt: args.now,
      createdAt: args.now,
      updatedAt: args.now,
    });

    const initialCredits = await getInitialCreditsSetting(ctx);
    await ctx.db.insert("creditAccounts", {
      userId,
      balanceCredits: initialCredits,
      totalPurchasedCredits: 0,
      totalAdminGrantedCredits: 0,
      totalSpentCredits: 0,
      updatedAt: args.now,
    });
    await ctx.db.patch(registration._id, { consumedAt: args.now });

    return { status: "success" as const, userId };
  },
});

// Delete user
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

export const deleteAccountCascade = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = args.userId as string;

    const spreadsheets = await ctx.db
      .query("spreadsheets")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const spreadsheet of spreadsheets) {
      const [cells, formatting, widths, heights, columnNames] = await Promise.all([
        ctx.db.query("cells").withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", spreadsheet._id)).collect(),
        ctx.db
          .query("cellFormatting")
          .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", spreadsheet._id))
          .collect(),
        ctx.db.query("columnWidths").withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", spreadsheet._id)).collect(),
        ctx.db.query("rowHeights").withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", spreadsheet._id)).collect(),
        ctx.db.query("columnNames").withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", spreadsheet._id)).collect(),
      ]);

      for (const record of [...cells, ...formatting, ...widths, ...heights, ...columnNames]) {
        await ctx.db.delete(record._id);
      }

      await ctx.db.delete(spreadsheet._id);
    }

    const contexts = await ctx.db
      .query("contexts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const context of contexts) {
      await ctx.db.delete(context._id);
    }

    const creditAccounts = await ctx.db
      .query("creditAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const account of creditAccounts) {
      await ctx.db.delete(account._id);
    }

    const packageAssignments = await ctx.db
      .query("packageAssignments")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const assignment of packageAssignments) {
      await ctx.db.delete(assignment._id);
    }

    const creditTransactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const transaction of creditTransactions) {
      await ctx.db.delete(transaction._id);
    }

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
