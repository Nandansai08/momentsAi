"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Read theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme");
    const initialTheme = savedTheme === "dark" ? "dark" : "light";
    
    // Sync class list with local state immediately to avoid layout flash
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Defer all state updates to avoid synchronous cascading renders inside useEffect body
    setTimeout(() => {
      if (initialTheme !== "light") {
        setTheme(initialTheme);
      }
      setMounted(true);
    }, 0);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("dashboard-theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Avoid hydration mismatch by rendering a placeholder shell
  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground opacity-50"
        aria-hidden="true"
      >
        <span className="w-5 h-5 block" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="w-10 h-10 rounded-xl border border-border bg-card hover:bg-secondary hover:text-foreground flex items-center justify-center text-muted-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 fill-indigo-600/10" />
      )}
    </button>
  );
}
