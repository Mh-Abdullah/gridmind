import { v } from "convex/values"

import type { Doc } from "./_generated/dataModel"
import type { MutationCtx, QueryCtx } from "./_generated/server"
import { mutation, query } from "./_generated/server"
import { FREE_TIER_CREDITS } from "../lib/access-policy"
import { DEFAULT_USAGE_PRICING, calculateSalePriceCents, getEffectiveCreditsCost } from "../lib/billing-config"
import { parsePackageDescription } from "../lib/package-period"

async function getOrCreateCreditAccount(ctx: MutationCtx, userId: string): Promise<Doc<"creditAccounts">> {
  const existing = await ctx.db
    .query("creditAccounts")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first()

  if (existing) {
    return existing
  }

  const user = await getUserRecordById(ctx, userId)
  const startingCredits = user?.role === "user" ? await getInitialCreditsSetting(ctx) : 0

  const accountId = await ctx.db.insert("creditAccounts", {
    userId,
    balanceCredits: startingCredits,
    totalPurchasedCredits: 0,
    totalAdminGrantedCredits: 0,
    totalSpentCredits: 0,
    updatedAt: Date.now(),
  })

  const created = await ctx.db.get(accountId)
  if (!created) {
    throw new Error("Failed to initialize credit account")
  }
  return created
}

async function getUserRecordById(ctx: MutationCtx | QueryCtx, userId: string) {
  const users = await ctx.db.query("users").collect()
  return users.find((user) => user._id === userId) ?? null
}

async function getUserRecordByEmail(ctx: MutationCtx | QueryCtx, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email.trim().toLowerCase()))
    .first()
}

async function getInitialCreditsSetting(ctx: MutationCtx | QueryCtx) {
  const settings = await ctx.db.query("billingSettings").first()
  return settings?.initialCredits ?? FREE_TIER_CREDITS
}

async function requireAdmin(ctx: MutationCtx, adminUserId: string) {
  const admin = await getUserRecordById(ctx, adminUserId)
  if (!admin || admin.role !== "admin") {
    throw new Error("Admin access required")
  }
}

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeUsageRule(input: {
  creditsCost: number
  internalCostCents: number
  markupMultiplier: number
}) {
  const internalCostCents = Math.max(0, Math.round(input.internalCostCents))
  const markupMultiplier = Math.max(1, input.markupMultiplier)
  return {
    creditsCost: Math.max(0, Math.round(input.creditsCost)),
    internalCostCents,
    markupMultiplier,
    userChargeCents: calculateSalePriceCents(internalCostCents, markupMultiplier),
  }
}

function getPackageExpiresAt(createdAt: number, periodMonths?: number) {
  if (!Number.isFinite(createdAt) || !periodMonths || !Number.isFinite(periodMonths) || periodMonths <= 0) {
    return undefined
  }

  const expiresAt = new Date(createdAt)
  expiresAt.setMonth(expiresAt.getMonth() + periodMonths)
  return expiresAt.getTime()
}

function buildCreditSourceBreakdown(account?: {
  balanceCredits?: number
  totalPurchasedCredits?: number
  totalAdminGrantedCredits?: number
  totalSpentCredits?: number
} | null) {
  const balanceCredits = account?.balanceCredits ?? 0
  const totalPurchasedCredits = account?.totalPurchasedCredits ?? 0
  const totalAdminGrantedCredits = account?.totalAdminGrantedCredits ?? 0
  const totalSpentCredits = account?.totalSpentCredits ?? 0

  const inferredFreeCredits = Math.max(
    0,
    balanceCredits + totalSpentCredits - totalPurchasedCredits - totalAdminGrantedCredits
  )

  let remainingSpent = totalSpentCredits

  const freeUsed = Math.min(inferredFreeCredits, remainingSpent)
  remainingSpent -= freeUsed

  const grantedUsed = Math.min(totalAdminGrantedCredits, remainingSpent)
  remainingSpent -= grantedUsed

  const purchasedUsed = Math.min(totalPurchasedCredits, remainingSpent)

  return {
    inferredFreeCredits,
    purchasedUsed,
    purchasedRemaining: Math.max(0, totalPurchasedCredits - purchasedUsed),
    grantedUsed,
    grantedRemaining: Math.max(0, totalAdminGrantedCredits - grantedUsed),
  }
}

function getBillableUnits(actionKey: string, quantity: number) {
  const normalizedQuantity = Math.max(1, Math.round(quantity))

  if (
    actionKey === "run_column_ai" ||
    actionKey === "run_column_scrape" ||
    actionKey === "run_column_read_file" ||
    actionKey === "generate_template" ||
    actionKey === "create_table_local_search" ||
    actionKey === "create_table_google_search"
  ) {
    // Charge row-based tools in small row batches so larger runs scale gently.
    return Math.max(1, Math.ceil(normalizedQuantity / 10))
  }

  return normalizedQuantity
}

async function getActivePackageLocks(ctx: QueryCtx | MutationCtx, userId: string) {
  try {
    const assignments = await ctx.db
      .query("packageAssignments")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()
    const packages = await ctx.db.query("billingPackages").collect()

    const packageById = new Map(packages.map((pkg) => [pkg._id, pkg]))
    const now = Date.now()
    const activeLocks = new Map<string, { packageId: string; packageName: string; lockedUntil?: number }>()

    for (const assignment of assignments) {
      if (assignment.status !== "active") {
        continue
      }

      const pkg = packageById.get(assignment.packageId)
      if (!pkg) {
        continue
      }

      const lockedUntil = getPackageExpiresAt(assignment.createdAt, pkg.periodMonths)
      if (lockedUntil && lockedUntil <= now) {
        continue
      }

      activeLocks.set(String(assignment.packageId), {
        packageId: String(assignment.packageId),
        packageName: assignment.packageName,
        lockedUntil,
      })
    }

    return activeLocks
  } catch (error) {
    console.error("[billing] Failed to resolve active package locks", { userId, error })
    return new Map()
  }
}

export const getPublicPackages = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, { userId }) => {
    try {
      const packages = await ctx.db
        .query("billingPackages")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect()

      const activeLocks = userId ? await getActivePackageLocks(ctx, userId) : null

      return packages
        .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.salePriceCents - b.salePriceCents)
        .map((pkg) => {
          const parsed = parsePackageDescription(pkg.description)
          return {
            id: pkg._id,
            name: pkg.name,
            slug: pkg.slug,
            description: parsed.description,
            periodMonths: pkg.periodMonths ?? parsed.periodMonths,
            credits: pkg.credits,
            salePriceCents: pkg.salePriceCents,
            polarProductId: pkg.polarProductId,
            isFeatured: pkg.isFeatured,
            isLockedForUser: activeLocks?.has(String(pkg._id)) ?? false,
            lockedUntil: activeLocks?.get(String(pkg._id))?.lockedUntil,
          }
        })
    } catch (error) {
      console.error("[billing] Failed to load public packages", { userId, error })
      return []
    }
  },
})

export const getUserPackagePurchaseStatus = query({
  args: {
    userId: v.string(),
    packageId: v.id("billingPackages"),
  },
  handler: async (ctx, { userId, packageId }) => {
    const activeLocks = await getActivePackageLocks(ctx, userId)
    const lock = activeLocks.get(String(packageId))

    return {
      isLocked: Boolean(lock),
      lockedUntil: lock?.lockedUntil,
      packageName: lock?.packageName,
    }
  },
})

export const getPackageById = query({
  args: { packageId: v.id("billingPackages") },
  handler: async (ctx, { packageId }) => {
    return await ctx.db.get(packageId)
  },
})

export const findPackageByPolarProductId = query({
  args: { polarProductId: v.string() },
  handler: async (ctx, { polarProductId }) => {
    const packages = await ctx.db.query("billingPackages").collect()
    return packages.find(
      (pkg) =>
        pkg.polarProductId === polarProductId ||
        pkg.polarSandboxProductId === polarProductId ||
        pkg.polarProductionProductId === polarProductId
    ) ?? null
  },
})

export const getAdminOverview = query({
  args: {},
  handler: async (ctx) => {
    const [packages, usagePricing, users, accounts] = await Promise.all([
      ctx.db.query("billingPackages").collect(),
      ctx.db.query("usagePricing").collect(),
      ctx.db.query("users").collect(),
      ctx.db.query("creditAccounts").collect(),
    ])
    const initialCredits = await getInitialCreditsSetting(ctx)

    const accountByUserId = new Map(accounts.map((account) => [account.userId, account]))
    const pricingByAction = new Map(usagePricing.map((rule) => [rule.actionKey, rule]))

    const mergedPricing = DEFAULT_USAGE_PRICING.map((rule) => {
      const existing = pricingByAction.get(rule.actionKey)
      if (existing) {
        return {
          ...existing,
          creditsCost: getEffectiveCreditsCost({
            actionKey: existing.actionKey,
            creditsCost: existing.creditsCost,
            internalCostCents: existing.internalCostCents,
            markupMultiplier: existing.markupMultiplier,
          }),
        }
      }
      const normalizedDefault = normalizeUsageRule(rule)
      return {
        _id: `default:${rule.actionKey}`,
        actionKey: rule.actionKey,
        label: rule.label,
        creditsCost: getEffectiveCreditsCost({
          actionKey: rule.actionKey,
          ...normalizedDefault,
        }),
        internalCostCents: normalizedDefault.internalCostCents,
        markupMultiplier: normalizedDefault.markupMultiplier,
        userChargeCents: normalizedDefault.userChargeCents,
        isActive: true,
        updatedAt: 0,
      }
    })

    return {
      settings: {
        initialCredits,
      },
      packages: packages.sort((a, b) => b.updatedAt - a.updatedAt),
      usagePricing: mergedPricing,
      users: users
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((user) => {
          const account = accountByUserId.get(user._id)
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            balanceCredits: account?.balanceCredits ?? 0,
            totalPurchasedCredits: account?.totalPurchasedCredits ?? 0,
            totalAdminGrantedCredits: account?.totalAdminGrantedCredits ?? 0,
          }
        }),
    }
  },
})

export const getAdminBillingAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const [users, accounts, assignments] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("creditAccounts").collect(),
      ctx.db.query("packageAssignments").collect(),
    ])

    const accountByUserId = new Map(accounts.map((account) => [account.userId, account]))
    const assignmentsByUserId = new Map<string, Doc<"packageAssignments">[]>()

    for (const assignment of assignments) {
      const list = assignmentsByUserId.get(assignment.userId) ?? []
      list.push(assignment)
      assignmentsByUserId.set(assignment.userId, list)
    }

    const purchasedUsers = users
      .filter((user) => user.role === "user")
      .map((user) => {
        const account = accountByUserId.get(user._id)
        const breakdown = buildCreditSourceBreakdown(account)
        const userAssignments = assignmentsByUserId.get(user._id) ?? []
        const purchasedAssignments = userAssignments.filter((item) => item.source === "polar_order")

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          purchasedCredits: account?.totalPurchasedCredits ?? 0,
          purchasedUsedCredits: breakdown.purchasedUsed,
          purchasedRemainingCredits: breakdown.purchasedRemaining,
          currentBalanceCredits: account?.balanceCredits ?? 0,
          totalSpentCredits: account?.totalSpentCredits ?? 0,
          packagePurchases: purchasedAssignments.length,
          latestPurchaseAt: purchasedAssignments.sort((a, b) => b.createdAt - a.createdAt)[0]?.createdAt,
        }
      })
      .filter((user) => user.purchasedCredits > 0)
      .sort((a, b) => b.purchasedCredits - a.purchasedCredits || b.currentBalanceCredits - a.currentBalanceCredits)

    const grantedUsers = users
      .filter((user) => user.role === "user")
      .map((user) => {
        const account = accountByUserId.get(user._id)
        const breakdown = buildCreditSourceBreakdown(account)
        const userAssignments = assignmentsByUserId.get(user._id) ?? []
        const packageGrantAssignments = userAssignments.filter((item) => item.source === "admin")

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          grantedCredits: account?.totalAdminGrantedCredits ?? 0,
          grantedUsedCredits: breakdown.grantedUsed,
          grantedRemainingCredits: breakdown.grantedRemaining,
          currentBalanceCredits: account?.balanceCredits ?? 0,
          totalSpentCredits: account?.totalSpentCredits ?? 0,
          packageGrantCount: packageGrantAssignments.length,
        }
      })
      .filter((user) => user.grantedCredits > 0)
      .sort((a, b) => b.grantedCredits - a.grantedCredits || b.currentBalanceCredits - a.currentBalanceCredits)

    return {
      overview: {
        purchasedUsers: purchasedUsers.length,
        grantedUsers: grantedUsers.length,
        totalPurchasedCredits: purchasedUsers.reduce((sum, user) => sum + user.purchasedCredits, 0),
        totalPurchasedUsedCredits: purchasedUsers.reduce((sum, user) => sum + user.purchasedUsedCredits, 0),
        totalPurchasedRemainingCredits: purchasedUsers.reduce((sum, user) => sum + user.purchasedRemainingCredits, 0),
        totalGrantedCredits: grantedUsers.reduce((sum, user) => sum + user.grantedCredits, 0),
        totalGrantedUsedCredits: grantedUsers.reduce((sum, user) => sum + user.grantedUsedCredits, 0),
        totalGrantedRemainingCredits: grantedUsers.reduce((sum, user) => sum + user.grantedRemainingCredits, 0),
      },
      purchasedUsers,
      grantedUsers,
    }
  },
})

export const updateBillingSettings = mutation({
  args: {
    adminUserId: v.string(),
    initialCredits: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const normalizedInitialCredits = Math.max(0, Math.round(args.initialCredits))
    const [existing, users, accounts] = await Promise.all([
      ctx.db.query("billingSettings").first(),
      ctx.db.query("users").collect(),
      ctx.db.query("creditAccounts").collect(),
    ])
    const now = Date.now()

    const userById = new Map<string, (typeof users)[number]>(users.map((user) => [user._id, user]))

    for (const account of accounts) {
      const user = userById.get(account.userId)
      if (!user || user.role !== "user") {
        continue
      }

      const isFreeOnlyAccount =
        (account.totalPurchasedCredits ?? 0) === 0 && (account.totalAdminGrantedCredits ?? 0) === 0

      if (!isFreeOnlyAccount) {
        continue
      }

      const recalculatedBalance = Math.max(0, normalizedInitialCredits - (account.totalSpentCredits ?? 0))

      await ctx.db.patch(account._id, {
        balanceCredits: recalculatedBalance,
        updatedAt: now,
      })
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        initialCredits: normalizedInitialCredits,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("billingSettings", {
      initialCredits: normalizedInitialCredits,
      updatedAt: now,
    })
  },
})

export const getUserBillingSummary = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const account = await ctx.db
      .query("creditAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first()

    const transactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    const assignments = await ctx.db
      .query("packageAssignments")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    return {
      balanceCredits: account?.balanceCredits ?? 0,
      totalPurchasedCredits: account?.totalPurchasedCredits ?? 0,
      totalAdminGrantedCredits: account?.totalAdminGrantedCredits ?? 0,
      totalSpentCredits: account?.totalSpentCredits ?? 0,
      recentPackageAllocations: assignments
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5),
      recentTransactions: transactions
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10),
    }
  },
})

export const getUserUsageDetails = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const transactions = await ctx.db
      .query("creditTransactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    const debitTransactions = transactions
      .filter((transaction) => transaction.type === "debit")
      .sort((a, b) => b.createdAt - a.createdAt)

    const usageByAction = new Map<
      string,
      {
        actionKey: string
        label: string
        totalCredits: number
        totalQuantity: number
        totalRuns: number
        lastUsedAt: number
      }
    >()

    for (const transaction of debitTransactions) {
      const actionKey = transaction.actionKey || "other"
      const existing = usageByAction.get(actionKey)
      const totalCredits = Math.abs(transaction.creditsDelta)
      const totalQuantity = transaction.quantity ?? 1

      if (existing) {
        existing.totalCredits += totalCredits
        existing.totalQuantity += totalQuantity
        existing.totalRuns += 1
        existing.lastUsedAt = Math.max(existing.lastUsedAt, transaction.createdAt)
        continue
      }

      const pricingRule = DEFAULT_USAGE_PRICING.find((rule) => rule.actionKey === actionKey)
      usageByAction.set(actionKey, {
        actionKey,
        label: pricingRule?.label || actionKey,
        totalCredits,
        totalQuantity,
        totalRuns: 1,
        lastUsedAt: transaction.createdAt,
      })
    }

    return {
      totalUsageEvents: debitTransactions.length,
      totalCreditsSpent: debitTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.creditsDelta), 0),
      usageByAction: Array.from(usageByAction.values()).sort((a, b) => b.totalCredits - a.totalCredits),
      recentUsage: debitTransactions.slice(0, 50),
    }
  },
})

export const upsertPackage = mutation({
  args: {
    adminUserId: v.string(),
    packageId: v.optional(v.id("billingPackages")),
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    periodMonths: v.optional(v.number()),
    credits: v.number(),
    salePriceCents: v.optional(v.number()),
    internalCostCents: v.optional(v.number()),
    markupMultiplier: v.optional(v.number()),
    polarProductId: v.optional(v.string()),
    polarSyncedAt: v.optional(v.number()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const slug = sanitizeSlug(args.slug || args.name)
    if (!slug) {
      throw new Error("Package slug is required")
    }

    const internalCostCents = Math.max(0, Math.round(args.internalCostCents ?? 0))
    const markupMultiplier = Math.max(1, args.markupMultiplier ?? 1)
    const parsedDescription = parsePackageDescription(args.description)
    const salePriceCents =
      args.salePriceCents !== undefined
        ? Math.max(0, Math.round(args.salePriceCents))
        : calculateSalePriceCents(internalCostCents, markupMultiplier)
    const periodMonths = args.periodMonths
      ? Math.max(1, Math.round(args.periodMonths))
      : parsedDescription.periodMonths

    const now = Date.now()
    const payload = {
      name: args.name.trim(),
      slug,
      description: parsedDescription.description,
      periodMonths,
      credits: Math.max(0, Math.round(args.credits)),
      internalCostCents,
      markupMultiplier,
      salePriceCents,
      polarProductId: args.polarProductId?.trim() || undefined,
      polarSyncedAt: args.polarSyncedAt,
      isActive: args.isActive,
      isFeatured: args.isFeatured,
      updatedAt: now,
    }

    const existingBySlug = await ctx.db
      .query("billingPackages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first()

    if (existingBySlug && existingBySlug._id !== args.packageId) {
      throw new Error("Another package already uses this slug")
    }

    if (args.packageId) {
      await ctx.db.patch(args.packageId, payload)
      return args.packageId
    }

    return await ctx.db.insert("billingPackages", {
      ...payload,
      createdAt: now,
    })
  },
})

export const deletePackage = mutation({
  args: {
    adminUserId: v.string(),
    packageId: v.id("billingPackages"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const pkg = await ctx.db.get(args.packageId)
    if (!pkg) {
      throw new Error("Package not found")
    }

    const existingAssignment = await ctx.db
      .query("packageAssignments")
      .withIndex("by_packageId", (q) => q.eq("packageId", args.packageId))
      .first()

    if (existingAssignment) {
      throw new Error("This package cannot be deleted because it has already been assigned or purchased.")
    }

    const relatedTransaction = (await ctx.db.query("creditTransactions").collect()).find(
      (transaction) => transaction.packageId === args.packageId
    )

    if (relatedTransaction) {
      throw new Error("This package cannot be deleted because it is already used in billing history.")
    }

    await ctx.db.delete(args.packageId)
    return { deleted: true }
  },
})

export const updatePackagePolarConnection = mutation({
  args: {
    adminUserId: v.string(),
    packageId: v.id("billingPackages"),
    polarProductId: v.string(),
    polarMode: v.union(v.literal("sandbox"), v.literal("production")),
    polarSyncedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const existing = await ctx.db.get(args.packageId)
    if (!existing) {
      throw new Error("Package not found")
    }

    // Product mappings that predate per-environment storage were created while
    // this app was configured for production. Preserve that mapping the first
    // time the package is synced in either environment.
    const legacyProductionProductId =
      !existing.polarProductEnvironment && !existing.polarProductionProductId
        ? existing.polarProductId
        : undefined

    await ctx.db.patch(args.packageId, {
      polarProductId: args.polarProductId,
      polarProductEnvironment: args.polarMode,
      ...(legacyProductionProductId
        ? { polarProductionProductId: legacyProductionProductId }
        : {}),
      ...(args.polarMode === "production"
        ? { polarProductionProductId: args.polarProductId }
        : { polarSandboxProductId: args.polarProductId }),
      polarSyncedAt: args.polarSyncedAt,
      updatedAt: Date.now(),
    })

    return args.packageId
  },
})

export const upsertUsagePricing = mutation({
  args: {
    adminUserId: v.string(),
    actionKey: v.string(),
    label: v.string(),
    creditsCost: v.number(),
    internalCostCents: v.number(),
    markupMultiplier: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const normalized = normalizeUsageRule(args)
    const existing = await ctx.db
      .query("usagePricing")
      .withIndex("by_actionKey", (q) => q.eq("actionKey", args.actionKey))
      .first()

    const payload = {
      actionKey: args.actionKey,
      label: args.label.trim(),
      isActive: args.isActive,
      updatedAt: Date.now(),
      ...normalized,
    }

    if (existing) {
      await ctx.db.patch(existing._id, payload)
      return existing._id
    }

    return await ctx.db.insert("usagePricing", payload)
  },
})

export const assignPackageToUser = mutation({
  args: {
    adminUserId: v.string(),
    userId: v.string(),
    packageId: v.id("billingPackages"),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const pkg = await ctx.db.get(args.packageId)
    if (!pkg) {
      throw new Error("Package not found")
    }

    const account = await getOrCreateCreditAccount(ctx, args.userId)
    if (!account) {
      throw new Error("Failed to create credit account")
    }

    const nextBalance = account.balanceCredits + pkg.credits
    const now = Date.now()

    const assignmentId = await ctx.db.insert("packageAssignments", {
      userId: args.userId,
      packageId: pkg._id,
      packageName: pkg.name,
      creditsGranted: pkg.credits,
      source: "admin",
      status: "active",
      note: args.note?.trim() || undefined,
      createdAt: now,
    })

    await ctx.db.patch(account._id, {
      balanceCredits: nextBalance,
      totalAdminGrantedCredits: account.totalAdminGrantedCredits + pkg.credits,
      updatedAt: now,
    })

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "grant",
      creditsDelta: pkg.credits,
      balanceAfter: nextBalance,
      packageId: pkg._id,
      assignmentId,
      note: args.note?.trim() || `Admin assigned ${pkg.name}`,
      createdAt: now,
    })

    return { assignmentId, balanceCredits: nextBalance }
  },
})

export const grantManualCredits = mutation({
  args: {
    adminUserId: v.string(),
    email: v.string(),
    credits: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminUserId)

    const email = args.email.trim().toLowerCase()
    if (!email) {
      throw new Error("User email is required")
    }

    const credits = Math.max(0, Math.round(args.credits))
    if (credits <= 0) {
      throw new Error("Credits must be greater than zero")
    }

    const user = await getUserRecordByEmail(ctx, email)
    if (!user) {
      throw new Error("User not found for the provided email")
    }

    const account = await getOrCreateCreditAccount(ctx, user._id)
    const nextBalance = account.balanceCredits + credits
    const now = Date.now()

    await ctx.db.patch(account._id, {
      balanceCredits: nextBalance,
      totalAdminGrantedCredits: account.totalAdminGrantedCredits + credits,
      updatedAt: now,
    })

    const transactionId = await ctx.db.insert("creditTransactions", {
      userId: user._id,
      type: "grant",
      creditsDelta: credits,
      balanceAfter: nextBalance,
      note: args.note?.trim() || `Manual credit grant by admin`,
      createdAt: now,
    })

    return {
      transactionId,
      userId: user._id,
      email: user.email,
      balanceCredits: nextBalance,
      creditsGranted: credits,
    }
  },
})

export const grantCreditsFromPolarOrder = mutation({
  args: {
    userId: v.string(),
    packageId: v.id("billingPackages"),
    polarOrderId: v.string(),
    polarCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingAssignment = await ctx.db
      .query("packageAssignments")
      .withIndex("by_polarOrderId", (q) => q.eq("polarOrderId", args.polarOrderId))
      .first()

    if (existingAssignment) {
      return { alreadyProcessed: true, assignmentId: existingAssignment._id }
    }

    const pkg = await ctx.db.get(args.packageId)
    if (!pkg) {
      throw new Error("Package not found")
    }

    const user = await getUserRecordById(ctx, args.userId)
    if (!user) {
      throw new Error("User not found")
    }

    if (args.polarCustomerId && user.polarCustomerId !== args.polarCustomerId) {
      await ctx.db.patch(user._id, {
        polarCustomerId: args.polarCustomerId,
        updatedAt: Date.now(),
      })
    }

    const account = await getOrCreateCreditAccount(ctx, args.userId)
    if (!account) {
      throw new Error("Failed to create credit account")
    }

    const now = Date.now()
    const nextBalance = account.balanceCredits + pkg.credits

    const assignmentId = await ctx.db.insert("packageAssignments", {
      userId: args.userId,
      packageId: pkg._id,
      packageName: pkg.name,
      creditsGranted: pkg.credits,
      source: "polar_order",
      status: "active",
      polarOrderId: args.polarOrderId,
      note: `Polar order ${args.polarOrderId}`,
      createdAt: now,
    })

    await ctx.db.patch(account._id, {
      balanceCredits: nextBalance,
      totalPurchasedCredits: account.totalPurchasedCredits + pkg.credits,
      updatedAt: now,
    })

    await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "grant",
      creditsDelta: pkg.credits,
      balanceAfter: nextBalance,
      packageId: pkg._id,
      assignmentId,
      externalRef: args.polarOrderId,
      note: `Purchased ${pkg.name}`,
      createdAt: now,
    })

    return { alreadyProcessed: false, assignmentId, balanceCredits: nextBalance }
  },
})

export const consumeCredits = mutation({
  args: {
    userId: v.string(),
    actionKey: v.string(),
    quantity: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserRecordById(ctx, args.userId)
    if (!user) {
      throw new Error("User not found")
    }

    const configuredRule = await ctx.db
      .query("usagePricing")
      .withIndex("by_actionKey", (q) => q.eq("actionKey", args.actionKey))
      .first()

    const defaultRule = DEFAULT_USAGE_PRICING.find((rule) => rule.actionKey === args.actionKey)

    const resolvedRule = configuredRule
      ? configuredRule
      : defaultRule
        ? {
            ...normalizeUsageRule(defaultRule),
            actionKey: defaultRule.actionKey,
            label: defaultRule.label,
            isActive: true,
            updatedAt: 0,
          }
        : null

    if (!resolvedRule || !resolvedRule.isActive) {
      return { skipped: true }
    }

    const quantity = Math.max(1, Math.round(args.quantity ?? 1))
    const billableUnits = getBillableUnits(args.actionKey, quantity)
    const effectiveCreditsCost = getEffectiveCreditsCost({
      actionKey: resolvedRule.actionKey,
      creditsCost: resolvedRule.creditsCost,
      internalCostCents: resolvedRule.internalCostCents,
      markupMultiplier: resolvedRule.markupMultiplier,
    })
    const creditsToCharge = effectiveCreditsCost * billableUnits
    const internalCostCents = resolvedRule.internalCostCents * billableUnits
    const userChargeCents = resolvedRule.userChargeCents * billableUnits

    const account = await getOrCreateCreditAccount(ctx, args.userId)
    if (!account) {
      throw new Error("Failed to create credit account")
    }

    if (account.balanceCredits < creditsToCharge) {
      throw new Error(
        `Not enough credits. Required ${creditsToCharge}, available ${account.balanceCredits}.`
      )
    }

    const nextBalance = account.balanceCredits - creditsToCharge
    const now = Date.now()

    await ctx.db.patch(account._id, {
      balanceCredits: nextBalance,
      totalSpentCredits: account.totalSpentCredits + creditsToCharge,
      updatedAt: now,
    })

    const transactionId = await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "debit",
      creditsDelta: -creditsToCharge,
      balanceAfter: nextBalance,
      actionKey: args.actionKey,
      quantity,
      internalCostCents,
      userChargeCents,
      note: args.note?.trim() || resolvedRule.label,
      createdAt: now,
    })

    return {
      skipped: false,
      transactionId,
      balanceCredits: nextBalance,
      quantity,
      creditsCharged: creditsToCharge,
      internalCostCents,
      userChargeCents,
    }
  },
})

export const refundCreditTransaction = mutation({
  args: {
    userId: v.string(),
    transactionId: v.id("creditTransactions"),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId)
    if (!transaction || transaction.userId !== args.userId || transaction.type !== "debit") {
      throw new Error("Charge transaction not found")
    }

    const existingRefund = await ctx.db
      .query("creditTransactions")
      .withIndex("by_externalRef", (q) => q.eq("externalRef", String(transaction._id)))
      .first()

    if (existingRefund) {
      return { alreadyRefunded: true }
    }

    const account = await getOrCreateCreditAccount(ctx, args.userId)
    if (!account) {
      throw new Error("Failed to create credit account")
    }

    const refundedCredits = Math.abs(transaction.creditsDelta)
    const nextBalance = account.balanceCredits + refundedCredits
    const now = Date.now()

    await ctx.db.patch(account._id, {
      balanceCredits: nextBalance,
      totalSpentCredits: Math.max(0, account.totalSpentCredits - refundedCredits),
      updatedAt: now,
    })

    const refundId = await ctx.db.insert("creditTransactions", {
      userId: args.userId,
      type: "refund",
      creditsDelta: refundedCredits,
      balanceAfter: nextBalance,
      actionKey: transaction.actionKey,
      quantity: transaction.quantity,
      internalCostCents: transaction.internalCostCents,
      userChargeCents: transaction.userChargeCents,
      externalRef: String(transaction._id),
      note: args.note?.trim() || `Refund for ${transaction.note || transaction.actionKey}`,
      createdAt: now,
    })

    return { alreadyRefunded: false, refundId, balanceCredits: nextBalance }
  },
})
