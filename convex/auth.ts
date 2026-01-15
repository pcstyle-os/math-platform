import { AuthKit, type AuthFunctions } from "@convex-dev/workos-authkit";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

// Get a typed object of internal Convex functions exported by this file
const authFunctions: AuthFunctions = internal.auth;

// Note: These env vars must be set in the Convex dashboard for the app to function.
export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
    authFunctions,
});

export const { authKitEvent } = authKit.events({
    "user.created": async (ctx, event) => {
        const now = Date.now();
        const startOfMonth = new Date(now);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        await ctx.db.insert("users", {
            userId: event.data.id,
            email: event.data.email,
            role: (event.data.metadata?.role as string) || "member",
            theme: "minimalistic-warm",
            xp: 0,
            streak: 1,
            lastLogin: now,
            lastResetAt: startOfMonth.getTime(),
            monthlyGenerations: 0,
            monthlyMessages: 0,
            monthlyAudioSeconds: 0,
        });
    },
    "user.updated": async (ctx, event) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_user", (q) => q.eq("userId", event.data.id))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                email: event.data.email,
                role: (event.data.metadata?.role as string) || existing.role,
            });
        }
    },
    "user.deleted": async (ctx, event) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_user", (q) => q.eq("userId", event.data.id))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});