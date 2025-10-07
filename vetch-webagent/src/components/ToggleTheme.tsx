"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ToggleThemeProps {
  variant?: "full" | "icon";
}

const ToggleTheme = ({ variant = "full" }: ToggleThemeProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dark = theme === "dark" || resolvedTheme === "dark";

  // Versi full (toggle switch)
  if (variant === "full") {
    return (
      <button
        onClick={() => setTheme(dark ? "light" : "dark")}
        className={`
          relative w-14 h-8 rounded-full transition-colors duration-300
          ${dark ? "bg-[#04014A]" : "bg-white"}
        `}
      >
        <span
          className={`
            absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center
            transform transition-transform duration-300
            ${dark ? "translate-x-6" : "translate-x-0"}
          `}
        >
          {dark ? (
            <Moon className="h-4 w-4 text-[#1F2D2A]" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-400" />
          )}
        </span>
      </button>
    );
  }

  // Versi icon saja
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`
        p-2 rounded-full transition-colors duration-300
        ${dark ? "bg-[#04014A] text-white" : "bg-gray-100 text-yellow-600"}
        hover:scale-110 transform transition-transform
      `}
    >
      {dark ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ToggleTheme;