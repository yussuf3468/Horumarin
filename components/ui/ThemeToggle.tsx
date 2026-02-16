"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-surface-muted border border-border" />
    );
  }

  return (
    <motion.button
      type="button"
      disabled
      className="relative w-14 h-8 rounded-full bg-surface-muted border border-border transition-colors duration-300 hover:border-border-strong"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Theme is locked to dark mode"
    >
      {/* Toggle track background */}
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-primary-600 to-accent-600"
            : "bg-gradient-to-r from-cta-400 to-cta-500"
        }`}
      />

      {/* Toggle thumb */}
      <motion.div
        className="absolute top-1 w-6 h-6 bg-surface rounded-full shadow-md flex items-center justify-center"
        initial={false}
        animate={{
          x: 24,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <svg
          className="w-4 h-4 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}
