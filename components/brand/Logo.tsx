/**
 * MIDEEYE LOGO SYSTEM
 *
 * Symbolism:
 * - Rising sun rays = Progress, enlightenment, dawn of knowledge
 * - Book base = Knowledge, learning, wisdom
 * - Upward movement = Growth (MIDEEYE means "progress/development")
 * - Teal + Deep Blue = Modern, trustworthy, innovative
 * - Star element = Somali cultural identity, excellence
 *
 * Versions:
 * - Full (icon + wordmark)
 * - Icon only (for favicon)
 * - Horizontal layout
 * - Stacked layout
 */

import React from "react";

// ========================================
// LOGO ICON
// ========================================
export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 40,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Book base */}
    <path
      d="M8 28 C8 28, 8 36, 8 38 C8 40, 10 42, 12 42 L36 42 C38 42, 40 40, 40 38 L40 28 Z"
      fill="url(#bookGradient)"
    />

    {/* Book pages */}
    <rect
      x="10"
      y="28"
      width="28"
      height="2"
      rx="1"
      fill="#E5E7EB"
      opacity="0.6"
    />
    <rect
      x="10"
      y="32"
      width="28"
      height="2"
      rx="1"
      fill="#E5E7EB"
      opacity="0.4"
    />

    {/* Rising sun rays (representing knowledge enlightenment) */}
    <g opacity="0.9">
      {/* Center ray */}
      <path
        d="M24 6 L24 20"
        stroke="url(#rayGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Left rays */}
      <path
        d="M16 10 L20 18"
        stroke="url(#rayGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M10 16 L16 20"
        stroke="url(#rayGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Right rays */}
      <path
        d="M32 10 L28 18"
        stroke="url(#rayGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M38 16 L32 20"
        stroke="url(#rayGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>

    {/* Star of knowledge (Somali identity) */}
    <circle cx="24" cy="22" r="5" fill="url(#starGradient)" />
    <path
      d="M24 18 L25 21 L28 21 L25.5 23 L26.5 26 L24 24 L21.5 26 L22.5 23 L20 21 L23 21 Z"
      fill="white"
      opacity="0.9"
    />

    {/* Gradients */}
    <defs>
      <linearGradient
        id="bookGradient"
        x1="8"
        y1="28"
        x2="40"
        y2="42"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>

      <linearGradient
        id="rayGradient"
        x1="24"
        y1="6"
        x2="24"
        y2="20"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>

      <linearGradient
        id="starGradient"
        x1="19"
        y1="17"
        x2="29"
        y2="27"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2dd4bf" />
      </linearGradient>
    </defs>
  </svg>
);

// ========================================
// LOGO WORDMARK
// ========================================
export const LogoWordmark: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <svg
    width="140"
    height="32"
    viewBox="0 0 140 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <text
      x="0"
      y="24"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="24"
      fontWeight="700"
      fill="url(#wordmarkGradient)"
      letterSpacing="-0.02em"
    >
      MIDEEYE
    </text>

    <defs>
      <linearGradient
        id="wordmarkGradient"
        x1="0"
        y1="0"
        x2="140"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#0d9488" />
      </linearGradient>
    </defs>
  </svg>
);

// ========================================
// FULL LOGO (HORIZONTAL)
// ========================================
export const Logo: React.FC<{
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}> = ({ className = "", showWordmark = true, size = "md" }) => {
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const wordmarkSizes = {
    sm: { width: 112, height: 24 },
    md: { width: 140, height: 32 },
    lg: { width: 168, height: 40 },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={iconSizes[size]} />
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <span
            className="font-bold tracking-tight"
            style={{
              fontSize:
                size === "sm" ? "18px" : size === "md" ? "22px" : "28px",
              background: "linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            MIDEEYE
          </span>
          {size !== "sm" && (
            <span className="text-xs text-foreground-muted -mt-1">
              Aqoonta Bulshada
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ========================================
// FAVICON (Simplified for 16x16 / 32x32)
// ========================================
export const FaviconSVG = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Simplified book -->
  <path d="M4 18 C4 18, 4 24, 4 26 C4 28, 6 30, 8 30 L24 30 C26 30, 28 28, 28 26 L28 18 Z" fill="url(#bookGrad)"/>
  
  <!-- Center ray -->
  <path d="M16 4 L16 14" stroke="url(#rayGrad)" stroke-width="2.5" stroke-linecap="round"/>
  
  <!-- Star -->
  <circle cx="16" cy="15" r="4" fill="url(#starGrad)"/>
  <path d="M16 12 L16.8 14.5 L19 14.5 L17.2 16 L18 18.5 L16 17 L14 18.5 L14.8 16 L13 14.5 L15.2 14.5 Z" fill="white" opacity="0.9"/>
  
  <defs>
    <linearGradient id="bookGrad" x1="4" y1="18" x2="28" y2="30">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
    <linearGradient id="rayGrad" x1="16" y1="4" x2="16" y2="14">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="starGrad" x1="12" y1="11" x2="20" y2="19">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#2dd4bf"/>
    </linearGradient>
  </defs>
</svg>
`;

// ========================================
// USAGE GUIDELINES
// ========================================
export const LogoUsageGuidelines = `
MIDEEYE LOGO USAGE GUIDELINES
================================

SYMBOLISM:
- Rising sun rays: Enlightenment, progress, new dawn of knowledge
- Book base: Foundation of learning, wisdom, structured knowledge
- Central star: Excellence, Somali cultural identity, guidance
- Upward movement: Growth and development (MIDEEYE)
- Gradient (blue to teal): Trust, innovation, modernity

COLOR VARIATIONS:
1. Primary: Full color gradient (default)
2. Dark mode: Light rays on dark background
3. Monochrome: Single color for special contexts
4. White: For dark backgrounds

MINIMUM SIZES:
- Digital: 32px height minimum
- Print: 0.5 inch height minimum
- Favicon: 16px, 32px versions provided

CLEAR SPACE:
Maintain clear space equal to the height of the icon on all sides

DO:
✓ Use on clean backgrounds
✓ Maintain aspect ratio
✓ Use provided color versions
✓ Scale proportionally

DON'T:
✗ Distort or skew
✗ Change colors arbitrarily
✗ Add effects (drop shadows, outlines)
✗ Rotate or flip
✗ Place on busy backgrounds without container

CONTEXTS:
- Header: Medium size with wordmark
- Footer: Small size with full branding
- Favicon: Icon only, simplified
- Social media: Square icon version
- Email: Horizontal full logo
`;

export default Logo;
