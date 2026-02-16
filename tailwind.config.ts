import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ========================================
      // SEMANTIC COLOR SYSTEM (CSS Variables)
      // ========================================
      colors: {
        // Semantic tokens
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-elevated":
          "rgb(var(--color-surface-elevated) / <alpha-value>)",
        "surface-muted": "rgb(var(--color-surface-muted) / <alpha-value>)",

        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        "foreground-muted":
          "rgb(var(--color-foreground-muted) / <alpha-value>)",
        "foreground-subtle":
          "rgb(var(--color-foreground-subtle) / <alpha-value>)",

        "primary-fg": "rgb(var(--color-primary-foreground) / <alpha-value>)",
        "accent-fg": "rgb(var(--color-accent-foreground) / <alpha-value>)",
        "cta-fg": "rgb(var(--color-cta-foreground) / <alpha-value>)",

        danger: "rgb(var(--color-danger) / <alpha-value>)",
        "danger-foreground":
          "rgb(var(--color-danger-foreground) / <alpha-value>)",
        "danger-muted": "rgb(var(--color-danger-muted) / <alpha-value>)",
        "danger-border": "rgb(var(--color-danger-border) / <alpha-value>)",

        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-subtle": "rgb(var(--color-border-subtle) / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong) / <alpha-value>)",

        muted: "rgb(var(--color-muted) / <alpha-value>)",
        "muted-foreground":
          "rgb(var(--color-muted-foreground) / <alpha-value>)",

        // Primary - Deep Blue
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8", // Main primary
          800: "#1e40af",
          900: "#1e3a8a", // Deep blue
          950: "#172554",
        },

        // Accent - Teal
        accent: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf", // Main accent
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },

        // CTA - Warm Amber
        cta: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Main CTA
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },

        // Neutrals with depth
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },

      // ========================================
      // SPACING (tighter, more controlled)
      // ========================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ========================================
      // TYPOGRAPHY
      // ========================================
      fontSize: {
        hero: [
          "clamp(2.5rem, 5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        display: [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
      },

      lineHeight: {
        tight: "1.1",
        snug: "1.3",
      },

      letterSpacing: {
        tighter: "-0.02em",
      },

      // ========================================
      // MAX WIDTHS
      // ========================================
      maxWidth: {
        reading: "720px",
        container: "1280px",
      },

      // ========================================
      // SHADOWS (depth & elevation)
      // ========================================
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        elevated:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "inner-glow": "inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)",
      },

      // ========================================
      // GRADIENTS (as background images)
      // ========================================
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)",
        "gradient-primary": "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        "gradient-cta": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        "gradient-card": "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
        "gradient-card-hover":
          "linear-gradient(to bottom, #fafafa 0%, #f0f9ff 100%)",
        "gradient-page":
          "linear-gradient(180deg, #fafafa 0%, #f0f9ff 50%, #fafafa 100%)",
        "gradient-badge": "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
        "gradient-orb":
          "radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3) 0%, rgba(45, 212, 191, 0.2) 50%, transparent 100%)",
      },

      // ========================================
      // ANIMATIONS
      // ========================================
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
