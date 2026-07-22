import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

const messageValidator = v.object({
  id: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  content: v.string(),
  timestamp: v.number(),
  isStreaming: v.optional(v.boolean()),
  thinkingSteps: v.optional(v.array(v.string())),
  activeStep: v.optional(v.string()),
  isThinkingDone: v.optional(v.boolean()),
});

async function assertTableOwnership(
  ctx: MutationCtx,
  userId: string,
  tableId: string,
) {
  const spreadsheet = await ctx.db
    .query("spreadsheets")
    .withIndex("by_tableId", (q) => q.eq("tableId", tableId))
    .first();

  if (!spreadsheet || (spreadsheet.userId !== userId && spreadsheet.userId !== "anonymous")) {
    throw new Error("Spreadsheet not found or access denied");
  }

  // Tables created by the old client could be persisted before auth finished
  // loading and were consequently owned by the "anonymous" placeholder.
  // Claim those legacy records on the first authenticated chat write.
  if (spreadsheet.userId === "anonymous") {
    const user = await ctx.db.get(userId as Id<"users">);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(spreadsheet._id, { userId, updatedAt: Date.now() });
  }
}

export const listByTable = query({
  args: {
    userId: v.string(),
    tableId: v.string(),
  },
  handler: async (ctx, args) => {
    const spreadsheet = await ctx.db
      .query("spreadsheets")
      .withIndex("by_tableId", (q) => q.eq("tableId", args.tableId))
      .first();

    if (
      !spreadsheet ||
      (spreadsheet.userId !== args.userId && spreadsheet.userId !== "anonymous")
    ) return [];

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user_table", (q) =>
        q.eq("userId", args.userId).eq("tableId", args.tableId)
      )
      .collect();

    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const upsert = mutation({
  args: {
    userId: v.string(),
    tableId: v.string(),
    sessionId: v.string(),
    title: v.string(),
    messages: v.array(messageValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await assertTableOwnership(ctx, args.userId, args.tableId);

    const existing = await ctx.db
      .query("chatSessions")
      .withIndex("by_user_table_session", (q) =>
        q
          .eq("userId", args.userId)
          .eq("tableId", args.tableId)
          .eq("sessionId", args.sessionId)
      )
      .first();

    const session = {
      title: args.title,
      messages: args.messages,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, session);
      return existing._id;
    }

    return await ctx.db.insert("chatSessions", {
      userId: args.userId,
      tableId: args.tableId,
      sessionId: args.sessionId,
      ...session,
    });
  },
});

export const remove = mutation({
  args: {
    userId: v.string(),
    tableId: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    await assertTableOwnership(ctx, args.userId, args.tableId);

    const session = await ctx.db
      .query("chatSessions")
      .withIndex("by_user_table_session", (q) =>
        q
          .eq("userId", args.userId)
          .eq("tableId", args.tableId)
          .eq("sessionId", args.sessionId)
      )
      .first();

    if (session) await ctx.db.delete(session._id);
  },
});
