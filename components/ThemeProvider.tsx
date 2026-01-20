"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useQuery(api.users.getSettings);

  useEffect(() => {
    // Priority: 1. DB Settings, 2. LocalStorage, 3. Default (creamy)
    const dbTheme = settings?.theme;
    const localTheme = localStorage.getItem("app-theme");
    const themeToApply = dbTheme || localTheme || "minimalistic-warm";

    document.documentElement.setAttribute("data-theme", themeToApply);
  }, [settings]);

  return <>{children}</>;
}
