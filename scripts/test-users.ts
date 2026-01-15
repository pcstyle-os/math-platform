
import { ConvexHttpClient } from "convex/browser";
import { api, internal } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function runTest() {
    console.log("🚀 Testing User Sync Logic...");
    const testUserId = "test_user_" + Date.now();
    const testEmail = `test_${Date.now()}@example.com`;

    try {
        // 1. Trigger sync
        console.log(`📡 Triggering sync for ${testUserId}...`);
        const result = await client.mutation(internal.users.testSync, {
            userId: testUserId,
            email: testEmail
        });
        
        console.log("✅ Sync Result:", result);

        if (result.streak !== 1 || result.xp !== 0) {
            throw new Error("Initial streak or XP is incorrect");
        }

        // 2. Verify record exists (via an internal query or by triggering again)
        console.log("🔄 Triggering sync again to verify streak persistence...");
        const result2 = await client.mutation(internal.users.testSync, {
            userId: testUserId,
            email: testEmail
        });
        
        console.log("✅ Second Sync Result:", result2);
        
        if (result2.streak !== 1) {
             throw new Error("Streak should stay 1 for same-day login");
        }

        console.log("\n🏁 User Sync Test passed!");
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

runTest();
