import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // ========================================
      // XIDDIG DESIGN SYSTEM — MIDEEYE
      // The Somali Knowledge Network
      // ========================================
      fontFamily: {
        heading: [
          "var(--font-heading)",
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "var(--font-body)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-body)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // ===================================
        // SEMANTIC TOKENS (CSS Variables)
        // ===================================
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

        // ===================================
        // BRAND PALETTE — XIDDIG (STAR)
        // ===================================

        // Primary — Electric Teal (Badda: The Ocean)
        primary: {
          50: "#E0FAF4",
          100: "#B3F3E6",
          200: "#7DEAD4",
          300: "#40DFC0",
          400: "#00D4A3",
          500: "#00BA8D",
          600: "#009B75",
          700: "#007D5E",
          800: "#006049",
          900: "#004434",
          950: "#00281E",
        },

        // Accent — Warm Gold (Qorraxda: The Sun)
        accent: {
          50: "#FFF8E6",
          100: "#FEECBB",
          200: "#FDDE8D",
          300: "#FCCE5E",
          400: "#FBB62E",
          500: "#F5A623",
          600: "#D97706",
          700: "#A86200",
          800: "#884C00",
          900: "#683800",
          950: "#4A2800",
        },

        // CTA — mirrors primary
        cta: {
          50: "#E0FAF4",
          100: "#B3F3E6",
          200: "#7DEAD4",
          300: "#40DFC0",
          400: "#00D4A3",
          500: "#00BA8D",
          600: "#009B75",
          700: "#007D5E",
          800: "#006049",
          900: "#004434",
          950: "#00281E",
        },

        // Neutrals
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      fontSize: {
        hero: [
          "clamp(2.8rem, 6vw, 5.5rem)",
          { lineHeight: "1.0", letterSpacing: "-0.04em", fontWeight: "800" },
        ],
        "hero-sm": [
          "clamp(2rem, 4vw, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        display: [
          "clamp(1.6rem, 3vw, 2.5rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-sm": [
          "clamp(1.2rem, 2vw, 1.7rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
      },

      lineHeight: {
        tight: "1.05",
        snug: "1.25",
      },

      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.02em",
        wider: "0.12em",
        widest: "0.2em",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      maxWidth: {
        reading: "720px",
        container: "1280px",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 24px rgba(0,0,0,0.10), 0 8px 40px rgba(0,0,0,0.06)",
        panel: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        float: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        elevated: "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
        "glow-teal":
          "0 0 24px rgba(0,212,163,0.28), 0 0 48px rgba(0,212,163,0.10)",
        "glow-gold":
          "0 0 24px rgba(245,166,35,0.30), 0 0 48px rgba(245,166,35,0.10)",
        "glow-teal-sm": "0 0 12px rgba(0,212,163,0.45)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.10)",
      },

      backgroundImage: {
        "mesh-dark":
          "radial-gradient(at 40% 20%, rgba(0,212,163,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(245,166,35,0.08) 0px, transparent 50%), radial-gradient(at 0% 60%, rgba(26,76,224,0.06) 0px, transparent 50%)",
        "mesh-light":
          "radial-gradient(at 40% 20%, rgba(0,186,141,0.07) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(245,166,35,0.05) 0px, transparent 50%)",
        "gradient-teal": "linear-gradient(135deg, #00D4A3 0%, #00BA8D 100%)",
        "gradient-gold": "linear-gradient(135deg, #FBB62E 0%, #F5A623 100%)",
        "gradient-brand": "linear-gradient(135deg, #00D4A3 0%, #FBB62E 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #080C1A 0%, #0C1224 60%, #121B32 100%)",
        "gradient-card": "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
        "gradient-badge": "linear-gradient(135deg, #00D4A3 0%, #00BA8D 100%)",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.35s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out",
        ticker: "ticker 25s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
