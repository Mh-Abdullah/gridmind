import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get or create a spreadsheet by tableId
export const getOrCreateSpreadsheet = mutation({
  args: {
    tableId: v.string(),
    userId: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if spreadsheet exists
    const existing = await ctx.db
      .query("spreadsheets")
      .withIndex("by_tableId", (q) => q.eq("tableId", args.tableId))
      .first();

    if (existing) {
      return existing._id;
    }

    // Create new spreadsheet
    const spreadsheetId = await ctx.db.insert("spreadsheets", {
      tableId: args.tableId,
      userId: args.userId,
      name: args.name || "Untitled",
      numRows: 1,
      numCols: 1,
      updatedAt: Date.now(),
    });

    return spreadsheetId;
  },
});

// Get spreadsheet by tableId
export const getSpreadsheet = query({
  args: { tableId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("spreadsheets")
      .withIndex("by_tableId", (q) => q.eq("tableId", args.tableId))
      .first();
  },
});

// Get all spreadsheets for a user
export const getSpreadsheetsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const spreadsheets = await ctx.db
      .query("spreadsheets")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Sort by updatedAt descending (most recent first)
    return spreadsheets.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Delete a spreadsheet and all its related data
export const deleteSpreadsheet = mutation({
  args: { spreadsheetId: v.id("spreadsheets") },
  handler: async (ctx, args) => {
    // Delete all cells
    const cells = await ctx.db
      .query("cells")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    for (const cell of cells) {
      await ctx.db.delete(cell._id);
    }
    
    // Delete all cell formatting
    const formatting = await ctx.db
      .query("cellFormatting")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    for (const fmt of formatting) {
      await ctx.db.delete(fmt._id);
    }
    
    // Delete all column widths
    const widths = await ctx.db
      .query("columnWidths")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    for (const w of widths) {
      await ctx.db.delete(w._id);
    }
    
    // Delete all row heights
    const heights = await ctx.db
      .query("rowHeights")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    for (const h of heights) {
      await ctx.db.delete(h._id);
    }
    
    // Delete the spreadsheet itself
    await ctx.db.delete(args.spreadsheetId);
  },
});

// Update spreadsheet metadata (rows, cols, name)
export const updateSpreadsheetMetadata = mutation({
  args: {
    spreadsheetId: v.id("spreadsheets"),
    name: v.optional(v.string()),
    numRows: v.optional(v.number()),
    numCols: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { spreadsheetId, ...updates } = args;
    await ctx.db.patch(spreadsheetId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Get all cells for a spreadsheet
export const getCells = query({
  args: { spreadsheetId: v.id("spreadsheets") },
  handler: async (ctx, args) => {
    const cells = await ctx.db
      .query("cells")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    
    // Convert to object format used by the component
    const cellsObj: { [key: string]: string } = {};
    for (const cell of cells) {
      cellsObj[cell.cellKey] = cell.value;
    }
    return cellsObj;
  },
});

// Update a single cell
export const updateCell = mutation({
  args: {
    spreadsheetId: v.id("spreadsheets"),
    cellKey: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if cell exists
    const existing = await ctx.db
      .query("cells")
      .withIndex("by_spreadsheet_cell", (q) =>
        q.eq("spreadsheetId", args.spreadsheetId).eq("cellKey", args.cellKey)
      )
      .first();

    if (existing) {
      if (args.value === "") {
        // Delete cell if value is empty
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, {
          value: args.value,
          updatedAt: Date.now(),
        });
      }
    } else if (args.value !== "") {
      await ctx.db.insert("cells", {
        spreadsheetId: args.spreadsheetId,
        cellKey: args.cellKey,
        value: args.value,
        updatedAt: Date.now(),
      });
    }

    // Update spreadsheet timestamp
    await ctx.db.patch(args.spreadsheetId, {
      updatedAt: Date.now(),
    });
  },
});

// Batch update multiple cells (more efficient for paste operations)
export const updateCellsBatch = mutation({
  args: {
    spreadsheetId: v.id("spreadsheets"),
    cells: v.array(v.object({
      cellKey: v.string(),
      value: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const cell of args.cells) {
      const existing = await ctx.db
        .query("cells")
        .withIndex("by_spreadsheet_cell", (q) =>
          q.eq("spreadsheetId", args.spreadsheetId).eq("cellKey", cell.cellKey)
        )
        .first();

      if (existing) {
        if (cell.value === "") {
          await ctx.db.delete(existing._id);
        } else {
          await ctx.db.patch(existing._id, {
            value: cell.value,
            updatedAt: Date.now(),
          });
        }
      } else if (cell.value !== "") {
        await ctx.db.insert("cells", {
          spreadsheetId: args.spreadsheetId,
          cellKey: cell.cellKey,
          value: cell.value,
          updatedAt: Date.now(),
        });
      }
    }

    // Update spreadsheet timestamp
    await ctx.db.patch(args.spreadsheetId, {
      updatedAt: Date.now(),
    });
  },
});

// Clear all cells in a spreadsheet
export const clearAllCells = mutation({
  args: { spreadsheetId: v.id("spreadsheets") },
  handler: async (ctx, args) => {
    const cells = await ctx.db
      .query("cells")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    
    for (const cell of cells) {
      await ctx.db.delete(cell._id);
    }

    await ctx.db.patch(args.spreadsheetId, {
      updatedAt: Date.now(),
    });
  },
});

// Get cell formatting
export const getCellFormatting = query({
  args: { spreadsheetId: v.id("spreadsheets") },
  handler: async (ctx, args) => {
    const formatting = await ctx.db
      .query("cellFormatting")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    
    const formattingObj: { [key: string]: any } = {};
    for (const fmt of formatting) {
      formattingObj[fmt.cellKey] = {
        bold: fmt.bold,
        italic: fmt.italic,
        underline: fmt.underline,
        alignment: fmt.alignment,
        textColor: fmt.textColor,
        backgroundColor: fmt.backgroundColor,
        fontSize: fmt.fontSize,
      };
    }
    return formattingObj;
  },
});

// Update cell formatting
export const updateCellFormatting = mutation({
  args: {
    spreadsheetId: v.id("spreadsheets"),
    cellKey: v.string(),
    formatting: v.object({
      bold: v.optional(v.boolean()),
      italic: v.optional(v.boolean()),
      underline: v.optional(v.boolean()),
      alignment: v.optional(v.union(v.literal("left"), v.literal("center"), v.literal("right"))),
      textColor: v.optional(v.string()),
      backgroundColor: v.optional(v.string()),
      fontSize: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cellFormatting")
      .withIndex("by_spreadsheet_cell", (q) =>
        q.eq("spreadsheetId", args.spreadsheetId).eq("cellKey", args.cellKey)
      )
      .first();

    const isEmpty = Object.values(args.formatting).every(v => v === undefined);

    if (existing) {
      if (isEmpty) {
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, {
          ...args.formatting,
          updatedAt: Date.now(),
        });
      }
    } else if (!isEmpty) {
      await ctx.db.insert("cellFormatting", {
        spreadsheetId: args.spreadsheetId,
        cellKey: args.cellKey,
        ...args.formatting,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get column widths
export const getColumnWidths = query({
  args: { spreadsheetId: v.id("spreadsheets") },
  handler: async (ctx, args) => {
    const widths = await ctx.db
      .query("columnWidths")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    
    const widthsObj: { [key: number]: number } = {};
    for (const w of widths) {
      widthsObj[w.colIndex] = w.width;
    }
    return widthsObj;
  },
});

// Update column width
export const updateColumnWidth = mutation({
  args: {
    spreadsheetId: v.id("spreadsheets"),
    colIndex: v.number(),
    width: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("columnWidths")
      .withIndex("by_spreadsheet_col", (q) =>
        q.eq("spreadsheetId", args.spreadsheetId).eq("colIndex", args.colIndex)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { width: args.width });
    } else {
      await ctx.db.insert("columnWidths", {
        spreadsheetId: args.spreadsheetId,
        colIndex: args.colIndex,
        width: args.width,
      });
    }
  },
});

// Get row heights
export const getRowHeights = query({
  args: { spreadsheetId: v.id("spreadsheets") },
  handler: async (ctx, args) => {
    const heights = await ctx.db
      .query("rowHeights")
      .withIndex("by_spreadsheet", (q) => q.eq("spreadsheetId", args.spreadsheetId))
      .collect();
    
    const heightsObj: { [key: number]: number } = {};
    for (const h of heights) {
      heightsObj[h.rowIndex] = h.height;
    }
    return heightsObj;
  },
});

// Update row height
export const updateRowHeight = mutation({
  args: {
    spreadsheetId: v.id("spreadsheets"),
    rowIndex: v.number(),
    height: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("rowHeights")
      .withIndex("by_spreadsheet_row", (q) =>
        q.eq("spreadsheetId", args.spreadsheetId).eq("rowIndex", args.rowIndex)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { height: args.height });
    } else {
      await ctx.db.insert("rowHeights", {
        spreadsheetId: args.spreadsheetId,
        rowIndex: args.rowIndex,
        height: args.height,
      });
    }
  },
});
