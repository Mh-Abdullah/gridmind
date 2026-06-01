import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getContextsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("contexts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createContext = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    icon: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, { userId, title, icon, content }) => {
    const now = Date.now();
    return await ctx.db.insert("contexts", {
      userId,
      title,
      icon,
      content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateContext = mutation({
  args: {
    id: v.id("contexts"),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { id, title, icon, content }) => {
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (title !== undefined) patch.title = title;
    if (icon !== undefined) patch.icon = icon;
    if (content !== undefined) patch.content = content;
    await ctx.db.patch(id, patch);
  },
});

export const deleteContext = mutation({
  args: { id: v.id("contexts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
