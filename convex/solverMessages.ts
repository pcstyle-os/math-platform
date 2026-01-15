import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authKit } from "./auth";

/**
 * Lists the last 50 messages for the current user in the solver.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authKit.getAuthUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("solverMessages")
      .withIndex("by_user", (q) => q.eq("userId", user.id))
      .order("desc")
      .take(50);
  },
});

/**
 * Adds a new message to the cloud history.
 */
export const add = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    attachment: v.optional(
      v.object({
        name: v.string(),
        preview: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await authKit.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.insert("solverMessages", {
      userId: user.id,
      role: args.role,
      content: args.content,
      attachment: args.attachment,
      createdAt: Date.now(),
    });
  },
});

/**
 * Clears the entire history for the current user.
 */
export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authKit.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const messages = await ctx.db
      .query("solverMessages")
      .withIndex("by_user", (q) => q.eq("userId", user.id))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
