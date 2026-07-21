import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    password: v.string(), // hashed password
    avatar: v.optional(v.string()),
    role: v.string(), // "user" or "admin"
    emailVerifiedAt: v.optional(v.number()),
    polarCustomerId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_polarCustomerId", ["polarCustomerId"]),

  passwordResetOtps: defineTable({
    email: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
    attempts: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email_createdAt", ["email", "createdAt"]),

  pendingRegistrations: defineTable({
    email: v.string(),
    name: v.string(),
    password: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
    attempts: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email_createdAt", ["email", "createdAt"]),

  // Spreadsheet documents - stores the main table metadata
  spreadsheets: defineTable({
    tableId: v.string(),
    userId: v.string(),
    name: v.string(),
    numRows: v.number(),
    numCols: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tableId", ["tableId"])
    .index("by_userId", ["userId"]),

  // Cell data - stores individual cell values for real-time sync
  cells: defineTable({
    spreadsheetId: v.id("spreadsheets"),
    cellKey: v.string(), // Format: "row-col" e.g., "0-0", "1-2"
    value: v.string(),
    updatedAt: v.number(),
  })
    .index("by_spreadsheet", ["spreadsheetId"])
    .index("by_spreadsheet_cell", ["spreadsheetId", "cellKey"]),

  // Cell formatting - stores formatting for cells
  cellFormatting: defineTable({
    spreadsheetId: v.id("spreadsheets"),
    cellKey: v.string(),
    bold: v.optional(v.boolean()),
    italic: v.optional(v.boolean()),
    underline: v.optional(v.boolean()),
    alignment: v.optional(v.union(v.literal("left"), v.literal("center"), v.literal("right"))),
    textColor: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    fontSize: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_spreadsheet", ["spreadsheetId"])
    .index("by_spreadsheet_cell", ["spreadsheetId", "cellKey"]),

  // Column widths
  columnWidths: defineTable({
    spreadsheetId: v.id("spreadsheets"),
    colIndex: v.number(),
    width: v.number(),
  })
    .index("by_spreadsheet", ["spreadsheetId"])
    .index("by_spreadsheet_col", ["spreadsheetId", "colIndex"]),

  // Row heights
  rowHeights: defineTable({
    spreadsheetId: v.id("spreadsheets"),
    rowIndex: v.number(),
    height: v.number(),
  })
    .index("by_spreadsheet", ["spreadsheetId"])
    .index("by_spreadsheet_row", ["spreadsheetId", "rowIndex"]),

  // Column names (user-defined header labels)
  columnNames: defineTable({
    spreadsheetId: v.id("spreadsheets"),
    colIndex: v.number(),
    name: v.string(),
  })
    .index("by_spreadsheet", ["spreadsheetId"])
    .index("by_spreadsheet_col", ["spreadsheetId", "colIndex"]),

  // Explicit field types override automatic value detection (for example File vs URL).
  columnFieldTypes: defineTable({
    spreadsheetId: v.id("spreadsheets"),
    colIndex: v.number(),
    fieldType: v.string(),
  })
    .index("by_spreadsheet", ["spreadsheetId"])
    .index("by_spreadsheet_col", ["spreadsheetId", "colIndex"]),

  // Contexts - reusable knowledge pieces
  contexts: defineTable({
    userId: v.string(),
    title: v.string(),
    icon: v.optional(v.string()),
    content: v.string(), // Markdown content
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  billingPackages: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    periodMonths: v.optional(v.number()),
    credits: v.number(),
    internalCostCents: v.number(),
    markupMultiplier: v.number(),
    salePriceCents: v.number(),
    polarProductId: v.optional(v.string()),
    polarProductEnvironment: v.optional(v.union(v.literal("sandbox"), v.literal("production"))),
    polarSandboxProductId: v.optional(v.string()),
    polarProductionProductId: v.optional(v.string()),
    polarSyncedAt: v.optional(v.number()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"])
    .index("by_featured", ["isFeatured"]),

  usagePricing: defineTable({
    actionKey: v.string(),
    label: v.string(),
    creditsCost: v.number(),
    internalCostCents: v.number(),
    markupMultiplier: v.number(),
    userChargeCents: v.number(),
    isActive: v.boolean(),
    updatedAt: v.number(),
  }).index("by_actionKey", ["actionKey"]),

  billingSettings: defineTable({
    initialCredits: v.number(),
    updatedAt: v.number(),
  }),

  creditAccounts: defineTable({
    userId: v.string(),
    balanceCredits: v.number(),
    totalPurchasedCredits: v.number(),
    totalAdminGrantedCredits: v.number(),
    totalSpentCredits: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  packageAssignments: defineTable({
    userId: v.string(),
    packageId: v.id("billingPackages"),
    packageName: v.string(),
    creditsGranted: v.number(),
    source: v.union(v.literal("admin"), v.literal("polar_order"), v.literal("refund")),
    status: v.union(v.literal("active"), v.literal("reversed")),
    polarOrderId: v.optional(v.string()),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_packageId", ["packageId"])
    .index("by_polarOrderId", ["polarOrderId"]),

  creditTransactions: defineTable({
    userId: v.string(),
    type: v.union(v.literal("grant"), v.literal("debit"), v.literal("refund")),
    creditsDelta: v.number(),
    balanceAfter: v.number(),
    actionKey: v.optional(v.string()),
    quantity: v.optional(v.number()),
    internalCostCents: v.optional(v.number()),
    userChargeCents: v.optional(v.number()),
    packageId: v.optional(v.id("billingPackages")),
    assignmentId: v.optional(v.id("packageAssignments")),
    externalRef: v.optional(v.string()),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_externalRef", ["externalRef"])
    .index("by_assignmentId", ["assignmentId"]),
});
