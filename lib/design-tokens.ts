/**
 * Design Token System - Mideeye Premium UI
 *
 * Centralized design tokens for typography, spacing, elevation, motion, and semantic colors.
 * Ensures visual consistency and premium feel across the platform.
 */

// =====================
// TYPOGRAPHY SCALE
// =====================

export const typography = {
  h1: {
    fontSize: "2.5rem", // 40px
    lineHeight: "1.2",
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "2rem", // 32px
    lineHeight: "1.25",
    fontWeight: "700",
    letterSpacing: "-0.01em",
  },
  h3: {
    fontSize: "1.5rem", // 24px
    lineHeight: "1.3",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  h4: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.4",
    fontWeight: "600",
    letterSpacing: "0",
  },
  h5: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.4",
    fontWeight: "600",
    letterSpacing: "0",
  },
  h6: {
    fontSize: "1rem", // 16px
    lineHeight: "1.5",
    fontWeight: "600",
    letterSpacing: "0",
  },
  body: {
    fontSize: "1rem", // 16px
    lineHeight: "1.6",
    fontWeight: "400",
    letterSpacing: "0",
  },
  bodyLarge: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.6",
    fontWeight: "400",
    letterSpacing: "0",
  },
  bodySmall: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.5",
    fontWeight: "400",
    letterSpacing: "0",
  },
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.4",
    fontWeight: "500",
    letterSpacing: "0.01em",
  },
  meta: {
    fontSize: "0.6875rem", // 11px
    lineHeight: "1.3",
    fontWeight: "500",
    letterSpacing: "0.02em",
    textTransform: "uppercase" as const,
  },
} as const;

// =====================
// SPACING SCALE (4px base)
// =====================

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
  "5xl": "6rem", // 96px
  "6xl": "8rem", // 128px
} as const;

// =====================
// ELEVATION LEVELS
// =====================

export const elevation = {
  none: {
    boxShadow: "none",
  },
  card: {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
  },
  cardHover: {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08)",
  },
  modal: {
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  dropdown: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  tooltip: {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
} as const;

// =====================
// MOTION DURATIONS
// =====================

export const motion = {
  instant: "0ms",
  fast: "150ms",
  medium: "250ms",
  slow: "350ms",
  slower: "500ms",

  // Easings
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// =====================
// SEMANTIC COLORS (Light Mode)
// =====================

export const lightColors = {
  // Background levels
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F3F4F6",
    elevated: "#FFFFFF",
  },

  // Surface colors
  surface: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    overlay: "rgba(0, 0, 0, 0.5)",
  },

  // Text colors
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
    link: "#3B82F6",
    linkHover: "#2563EB",
  },

  // Border colors
  border: {
    primary: "#E5E7EB",
    secondary: "#D1D5DB",
    focus: "#3B82F6",
    hover: "#9CA3AF",
  },

  // Accent colors
  accent: {
    primary: "#3B82F6",
    primaryHover: "#2563EB",
    primaryActive: "#1D4ED8",
    secondary: "#8B5CF6",
    secondaryHover: "#7C3AED",
  },

  // Status colors
  status: {
    success: "#10B981",
    successBg: "#D1FAE5",
    warning: "#F59E0B",
    warningBg: "#FEF3C7",
    danger: "#EF4444",
    dangerBg: "#FEE2E2",
    info: "#3B82F6",
    infoBg: "#DBEAFE",
  },

  // Muted colors
  muted: {
    primary: "#F3F4F6",
    secondary: "#E5E7EB",
    text: "#6B7280",
  },
} as const;

// =====================
// SEMANTIC COLORS (Dark Mode)
// =====================

export const darkColors = {
  // Background levels
  background: {
    primary: "#111827",
    secondary: "#1F2937",
    tertiary: "#374151",
    elevated: "#1F2937",
  },

  // Surface colors
  surface: {
    primary: "#1F2937",
    secondary: "#374151",
    overlay: "rgba(0, 0, 0, 0.7)",
  },

  // Text colors
  text: {
    primary: "#F9FAFB",
    secondary: "#D1D5DB",
    tertiary: "#9CA3AF",
    inverse: "#111827",
    link: "#60A5FA",
    linkHover: "#3B82F6",
  },

  // Border colors
  border: {
    primary: "#374151",
    secondary: "#4B5563",
    focus: "#60A5FA",
    hover: "#6B7280",
  },

  // Accent colors
  accent: {
    primary: "#3B82F6",
    primaryHover: "#60A5FA",
    primaryActive: "#93C5FD",
    secondary: "#8B5CF6",
    secondaryHover: "#A78BFA",
  },

  // Status colors
  status: {
    success: "#10B981",
    successBg: "#064E3B",
    warning: "#F59E0B",
    warningBg: "#78350F",
    danger: "#EF4444",
    dangerBg: "#7F1D1D",
    info: "#3B82F6",
    infoBg: "#1E3A8A",
  },

  // Muted colors
  muted: {
    primary: "#374151",
    secondary: "#4B5563",
    text: "#9CA3AF",
  },
} as const;

// =====================
// BORDER RADIUS
// =====================

export const radius = {
  none: "0",
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

// =====================
// Z-INDEX SCALE
// =====================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  floating: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;

// =====================
// BREAKPOINTS
// =====================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// =====================
// ANIMATION PRESETS
// =====================

export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: "translateY(10px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  slideInDown: {
    from: { transform: "translateY(-10px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  scaleIn: {
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
  votePop: {
    from: { transform: "scale(1)" },
    to: { transform: "scale(1.1)" },
  },
} as const;

// =====================
// UTILITY FUNCTIONS
// =====================

/**
 * Get color value based on theme
 */
export function getColor(path: string, isDark: boolean = false) {
  const colors = isDark ? darkColors : lightColors;
  const keys = path.split(".");
  let value: any = colors;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) return undefined;
  }

  return value;
}

/**
 * Apply typography style as CSS string
 */
export function applyTypography(variant: keyof typeof typography): string {
  const styles = typography[variant];
  return `
    font-size: ${styles.fontSize};
    line-height: ${styles.lineHeight};
    font-weight: ${styles.fontWeight};
    letter-spacing: ${styles.letterSpacing};
    ${(styles as any).textTransform ? `text-transform: ${(styles as any).textTransform};` : ""}
  `.trim();
}

/**
 * Create transition string
 */
export function transition(
  property: string = "all",
  duration: keyof typeof motion = "medium",
  easing: keyof typeof motion.easing = "default",
): string {
  return `${property} ${motion[duration]} ${motion.easing[easing]}`;
}

/**
 * Apply elevation
 */
export function applyElevation(level: keyof typeof elevation): string {
  return elevation[level].boxShadow;
}
