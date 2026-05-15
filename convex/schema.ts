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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]),

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
});
