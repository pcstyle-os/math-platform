import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Exams/Learning Paths
  exams: defineTable({
    userId: v.string(), // WorkOS User ID
    title: v.string(),
    subject: v.string(),
    subjectMode: v.union(v.literal("automatic"), v.literal("manual"), v.literal("other")),
    status: v.union(v.literal("generating"), v.literal("ready"), v.literal("error")),
    storageIds: v.array(v.id("_storage")), // Multiple uploaded PDFs
    data: v.optional(
      v.object({
        examTitle: v.string(),
        phase1_theory: v.array(
          v.object({
            topic: v.string(),
            content: v.string(),
          }),
        ),
        phase2_guided: v.array(
          v.object({
            question: v.string(),
            description: v.optional(v.string()),
            steps: v.array(v.string()),
            solution: v.string(),
            tips: v.optional(v.string()),
            hints: v.optional(v.array(v.string())),
          }),
        ),
        phase3_exam: v.array(
          v.object({
            question: v.string(),
            answer: v.string(),
          }),
        ),
        flashcards: v.optional(
          v.array(
            v.object({
              front: v.string(),
              back: v.string(),
            }),
          ),
        ),
      }),
    ),
    error: v.optional(v.string()),
    isSpeedrun: v.optional(v.boolean()),
    hoursAvailable: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // User Settings & Theme Preferences
  users: defineTable({
    userId: v.string(), // WorkOS User ID
    email: v.optional(v.string()),
    role: v.optional(v.string()), // 'member', 'admin', 'premium'
    theme: v.string(), // e.g., 'cybernetic-dark', 'normal-light', etc.
    customizations: v.optional(
      v.object({
        primaryColor: v.optional(v.string()),
      }),
    ),
    xp: v.optional(v.number()),
    streak: v.optional(v.number()),
    lastLogin: v.optional(v.number()),

    // Monthly Usage Tracking
    lastResetAt: v.optional(v.number()), // Timestamp of month start
    monthlyGenerations: v.optional(v.number()),
    monthlyMessages: v.optional(v.number()),
    monthlyAudioSeconds: v.optional(v.number()),

    // Solver Specific Settings (moved from localStorage to DB)
    solverSystemPrompt: v.optional(v.string()),
    solverDefaultHomepage: v.optional(v.boolean()),
    prefersSystemTheme: v.optional(v.boolean()),
    solverKnowledgeBase: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          content: v.string(),
          type: v.string(), // 'pdf' | 'md' | 'txt'
        }),
      ),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"]),

  // New: Solver Chat History (Synced)
  solverMessages: defineTable({
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    attachment: v.optional(
      v.object({
        name: v.string(),
        preview: v.optional(v.string()), // Still storing base64 for preview, ideally storageId
      }),
    ),
    createdAt: v.number(),
  }).index("by_user", ["userId", "createdAt"]),
});
