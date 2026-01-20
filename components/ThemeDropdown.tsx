"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Palette, Check, Loader2, ChevronDown } from "lucide-react";
import { useThemeLabels } from "@/hooks/useThemeLabels";

const themes = [
  {
    id: "minimalistic-light",
    name: "Modern White",
    color: "#ffffff",
  },
  {
    id: "minimalistic-dark",
    name: "Pure Dark",
    color: "#0a0a0a",
  },
  {
    id: "minimalistic-warm",
    name: "Paper Warm",
    color: "#fbfaf5",
  },
  {
    id: "cybernetic-dark",
    name: "Cyber Pink",
    color: "#ff00ff",
  },
];

export function ThemeDropdown() {
  const userSettings = useQuery(api.users.getUserDetails);
  const updateSettings = useMutation(api.users.updateSettings);
  const [selectedTheme, setSelectedTheme] = useState("minimalistic-warm");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { isCyber } = useThemeLabels();

  useEffect(() => {
    if (userSettings?.theme) {
      setSelectedTheme(userSettings.theme);
    }
  }, [userSettings]);

  const handleThemeChange = async (themeId: string) => {
    setSelectedTheme(themeId);
    setIsOpen(false);
    setIsSaving(true);
    try {
      await updateSettings({ theme: themeId });
      document.documentElement.setAttribute("data-theme", themeId);
      localStorage.setItem("app-theme", themeId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTheme = themes.find((t) => t.id === selectedTheme) || themes[2];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border transition-all duration-200 ${
          isCyber 
            ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5" 
            : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50 rounded-xl"
        }`}
      >
        <div
          className="w-4 h-4 rounded-full border border-black/10"
          style={{ backgroundColor: currentTheme.color }}
        />
        <span className="text-sm font-bold uppercase tracking-wider hidden sm:inline">
          {isCyber ? `_STYLE: ${currentTheme.name.toUpperCase()}` : currentTheme.name}
        </span>
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className={`absolute right-0 mt-2 w-56 z-50 overflow-hidden ${
              isCyber 
                ? "border border-[var(--primary)] bg-black shadow-[0_0_20px_var(--primary)]/20" 
                : "bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl backdrop-blur-xl"
            }`}
          >
            <div className="p-2 space-y-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${
                    selectedTheme === theme.id
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "hover:bg-[var(--primary)]/5 text-[var(--foreground)]"
                  } ${isCyber ? "" : "rounded-xl"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="text-sm font-bold tracking-tight">{theme.name}</span>
                  </div>
                  {selectedTheme === theme.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
