/**
 * MIDEEYE DESIGN SYSTEM
 *
 * Centralized design tokens for consistent visual language
 * Spacing, typography, colors, and effects
 */

// ========================================
// SPACING SCALE
// ========================================
// Use these tokens instead of arbitrary values
export const spacing = {
  xs: "4px", // 0.25rem - Minimal gaps
  sm: "8px", // 0.5rem - Tight spacing
  md: "12px", // 0.75rem - Compact elements
  base: "16px", // 1rem - Standard spacing
  lg: "24px", // 1.5rem - Section padding
  xl: "32px", // 2rem - Large gaps
  "2xl": "48px", // 3rem - Major sections
  "3xl": "64px", // 4rem - Hero spacing
  "4xl": "96px", // 6rem - Dramatic spacing
} as const;

// ========================================
// TYPOGRAPHY SCALE
// ========================================
export const typography = {
  // Hero & Display
  hero: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)", // 40px-64px
    lineHeight: "1.1",
    fontWeight: "800",
    letterSpacing: "-0.02em",
  },

  // Page Titles
  h1: {
    fontSize: "clamp(2rem, 4vw, 3rem)", // 32px-48px
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "-0.01em",
  },

  // Section Headings
  h2: {
    fontSize: "clamp(1.5rem, 3vw, 2rem)", // 24px-32px
    lineHeight: "1.3",
    fontWeight: "600",
  },

  // Card Titles
  h3: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.4",
    fontWeight: "600",
  },

  // Body Text
  body: {
    fontSize: "1rem", // 16px
    lineHeight: "1.6",
    fontWeight: "400",
  },

  // Small Text
  small: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.5",
    fontWeight: "400",
  },

  // Metadata
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.4",
    fontWeight: "500",
  },
} as const;

// ========================================
// COLOR SYSTEM
// ========================================

// Primary Palette - Deep Blue + Teal
export const colors = {
  // Primary Blues
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Base primary
    600: "#2563eb",
    700: "#1d4ed8", // Deep blue
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Teal Accents
  accent: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf", // Teal accent
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },

  // Warm CTA (Amber/Orange)
  cta: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Warm accent
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Neutrals with depth
  neutral: {
    50: "#fafafa", // Off-white background
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

  // Semantic Colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const;

// ========================================
// GRADIENT TOKENS
// ========================================
export const gradients = {
  // Hero background gradient
  hero: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)",

  // Primary button gradient
  primaryButton: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",

  // CTA button gradient
  ctaButton: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",

  // Card subtle gradient
  card: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",

  // Card hover gradient
  cardHover: "linear-gradient(to bottom, #fafafa 0%, #f0f9ff 100%)",

  // Background tint
  backgroundTint:
    "linear-gradient(180deg, #fafafa 0%, #f0f9ff 50%, #fafafa 100%)",

  // Section divider
  divider:
    "linear-gradient(90deg, transparent 0%, #e5e5e5 50%, transparent 100%)",

  // Badge gradient
  badge: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",

  // Orb (decorative)
  orb: "radial-gradient(circle at 30% 50%, #3b82f6 0%, #2dd4bf 50%, transparent 100%)",
} as const;

// ========================================
// SHADOWS & EFFECTS
// ========================================
export const shadows = {
  // Subtle card elevation
  card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",

  // Card hover state
  cardHover:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",

  // Strong elevation
  elevated:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",

  // Button shadow
  button:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",

  // Inner glow
  innerGlow: "inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)",
} as const;

// ========================================
// BORDER RADIUS
// ========================================
export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

// ========================================
// LAYOUT CONSTANTS
// ========================================
export const layout = {
  // Max content width
  maxWidth: "1280px",

  // Reading width (for text-heavy sections)
  readingWidth: "720px",

  // Container padding
  containerPadding: {
    mobile: spacing.base,
    tablet: spacing.lg,
    desktop: spacing.xl,
  },

  // Header height
  headerHeight: "72px",

  // Grid gaps
  gridGap: {
    sm: spacing.base,
    md: spacing.lg,
    lg: spacing.xl,
  },
} as const;

// ========================================
// ANIMATION CURVES
// ========================================
export const easing = {
  smooth: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  gentle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

// ========================================
// HELPER UTILITIES
// ========================================

/**
 * Convert design token to CSS custom property
 */
export function toCSS(token: string): string {
  return `var(--${token})`;
}

/**
 * Generate responsive spacing
 */
export function responsiveSpacing(mobile: string, desktop: string): string {
  return `clamp(${mobile}, 3vw, ${desktop})`;
}

/**
 * Max width container utility
 */
export const containerStyles = {
  maxWidth: layout.maxWidth,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: layout.containerPadding.mobile,
  paddingRight: layout.containerPadding.mobile,
} as const;
