
"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function UserSync() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const syncStats = useMutation(api.users.syncStats);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            syncStats().catch(err => {
                console.error("Failed to sync user stats:", err);
            });
        }
    }, [isAuthenticated, isLoading, syncStats]);

    return null;
}
