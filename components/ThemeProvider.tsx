"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useQuery(api.users.getSettings);

  useEffect(() => {
    // Priority: 1. LocalStorage (User choice), 2. DB Settings, 3. Default (creamy)
    const localTheme = localStorage.getItem("app-theme");
    const dbTheme = settings?.theme;
    const themeToApply = localTheme || dbTheme || "minimalistic-warm";

    document.documentElement.setAttribute("data-theme", themeToApply);
  }, [settings]);

  return <>{children}</>;
}
