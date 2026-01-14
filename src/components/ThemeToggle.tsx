"use client";

import { useEffect, useSyncExternalStore, useCallback } from "react";

type Theme = "light" | "dark" | "system";

// Get the actual resolved theme (light or dark)
const getResolvedTheme = (themeValue: Theme): "light" | "dark" => {
  if (themeValue === "system") {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  }
  return themeValue;
};

// Apply theme to document
const applyTheme = (themeValue: Theme) => {
  const resolved = getResolvedTheme(themeValue);
  if (resolved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
};

// Theme store using useSyncExternalStore for hydration-safe access
const themeStore = {
  getSnapshot: (): Theme => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem("theme");
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored as Theme;
    }
    return "system";
  },
  getServerSnapshot: (): Theme => "system",
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  setTheme: (theme: Theme) => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    window.dispatchEvent(new Event("storage"));
  },
};

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeStore.getSnapshot() === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Cycle through themes: system -> light -> dark -> system
  const cycleTheme = useCallback(() => {
    const next: Theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    themeStore.setTheme(next);
  }, [theme]);

  const resolvedTheme = getResolvedTheme(theme);

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg premium-button transition-all hover:scale-105"
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      title={`Theme: ${theme === "system" ? `System (${resolvedTheme})` : theme}`}
    >
      {theme === "system" ? (
        // System icon
        <svg
          className="w-5 h-5 text-[var(--foreground-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ) : resolvedTheme === "dark" ? (
        // Moon icon
        <svg
          className="w-5 h-5 text-[var(--foreground-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon
        <svg
          className="w-5 h-5 text-[var(--gold)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}
