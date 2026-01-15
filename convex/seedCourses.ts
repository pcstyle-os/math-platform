import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createCourse = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("courses", args);
  },
});

export const createChallenge = mutation({
  args: {
    slug: v.string(),
    courseId: v.optional(v.id("courses")),
    type: v.optional(v.union(v.literal("coding"), v.literal("theory"))),
    theoryContent: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    difficulty: v.number(),
    xpReward: v.number(),
    starterCode: v.optional(
      v.object({
        html: v.string(),
        css: v.string(),
        js: v.optional(v.string()),
      }),
    ),
    validation: v.optional(
      v.object({
        type: v.string(),
        rules: v.array(
          v.object({
            selector: v.string(),
            property: v.string(),
            expected: v.string(),
            hint: v.string(),
          }),
        ),
      }),
    ),
    hints: v.optional(v.array(v.string())),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("challenges")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      // Update existing challenge to ensure it's linked to the course and has latest content
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("challenges", args);
  },
});
