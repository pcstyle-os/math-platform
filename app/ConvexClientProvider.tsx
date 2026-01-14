
"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ReactNode, useCallback, useMemo } from "react";
import { AuthKitProvider, useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useWorkOSAuthBridge() {
    const { user, loading } = useAuth();
    const { getAccessToken } = useAccessToken();

    const fetchAccessToken = useCallback(async ({ forceRefresh }: { forceRefresh: boolean }) => {
        // Get access token (async to handle refresh if needed)
        return await getAccessToken();
    }, [getAccessToken]);

    return useMemo(() => ({
        isLoading: loading,
        isAuthenticated: !!user,
        fetchAccessToken,
    }), [loading, user, fetchAccessToken]);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <AuthKitProvider>
            <ConvexProviderWithAuth client={convex} useAuth={useWorkOSAuthBridge}>
                {children}
            </ConvexProviderWithAuth>
        </AuthKitProvider>
    );
}
