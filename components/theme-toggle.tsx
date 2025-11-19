"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="border-violet-400 bg-transparent hover:bg-violet-500/20 hover:rotate-12 transition-transform duration-200"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-violet-600 transition-transform dark:text-violet-400" />
      ) : (
        <Sun className="h-5 w-5 text-violet-400 transition-transform" />
      )}
    </Button>
  );
}
