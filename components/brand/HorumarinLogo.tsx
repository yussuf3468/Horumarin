/**
 * HORUMARIN LOGO - RISING SUN CONCEPT
 *
 * Symbolism:
 * - Rising sun rays forming top of "H" = Dawn of knowledge, enlightenment
 * - Upward arrow integrated into H = Progress, growth, horumarin (development)
 * - Star detail = Excellence, Somali identity, guidance
 * - Gradient (deep blue → gold) = Knowledge to enlightenment journey
 *
 * Premium, modern, meaningful - no generic fonts
 */

import React from "react";

// ========================================
// PRIMARY LOGO - ICON + WORDMARK
// ========================================
export const HorumarinLogo: React.FC<{
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}> = ({ className = "", size = "md", variant = "light" }) => {
  const sizes = {
    sm: { icon: 32, text: 18 },
    md: { icon: 48, text: 24 },
    lg: { icon: 64, text: 32 },
  };

  const s = sizes[size];
  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={s.icon} variant={variant} />
      <div className="flex flex-col -space-y-1">
        <span
          className="font-bold tracking-tight leading-none"
          style={{
            fontSize: `${s.text}px`,
            background: isDark
              ? "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)"
              : "linear-gradient(135deg, #1e3a8a 0%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em",
          }}
        >
          HORUMARIN
        </span>
        {size !== "sm" && (
          <span
            className="text-xs tracking-widest uppercase text-foreground-muted"
            style={{ fontSize: `${s.text * 0.35}px` }}
          >
            Aqoonta Bulshada
          </span>
        )}
      </div>
    </div>
  );
};

// ========================================
// LOGO ICON - RISING SUN H
// ========================================
export const LogoIcon: React.FC<{
  size?: number;
  variant?: "light" | "dark";
  className?: string;
}> = ({ size = 48, variant = "light", className = "" }) => {
  const isDark = variant === "dark";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rising sun rays forming top of H */}
      <g opacity="0.9">
        {/* Center ray - longest */}
        <path
          d="M32 8 L32 24"
          stroke="url(#sunGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Left rays */}
        <path
          d="M22 12 L26 22"
          stroke="url(#sunGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M14 18 L20 24"
          stroke="url(#sunGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Right rays */}
        <path
          d="M42 12 L38 22"
          stroke="url(#sunGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M50 18 L44 24"
          stroke="url(#sunGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {/* Letter H structure with integrated upward arrow */}
      <g>
        {/* Left pillar of H */}
        <rect
          x="18"
          y="24"
          width="6"
          height="32"
          rx="3"
          fill="url(#pillarGradient)"
        />

        {/* Right pillar of H */}
        <rect
          x="40"
          y="24"
          width="6"
          height="32"
          rx="3"
          fill="url(#pillarGradient)"
        />

        {/* Horizontal bar with upward arrow shape */}
        <path
          d="M 18 38 L 24 38 L 28 34 L 32 30 L 36 34 L 40 38 L 46 38 L 46 44 L 18 44 Z"
          fill="url(#arrowGradient)"
        />

        {/* Arrow point highlight */}
        <path
          d="M 28 34 L 32 30 L 36 34 L 32 38 Z"
          fill="url(#highlightGradient)"
          opacity="0.8"
        />
      </g>

      {/* Somali star detail - subtle integration */}
      <circle cx="32" cy="50" r="3" fill="url(#starGradient)" />
      <path
        d="M 32 47.5 L 32.5 49.5 L 34.5 49.5 L 33 50.5 L 33.5 52.5 L 32 51.5 L 30.5 52.5 L 31 50.5 L 29.5 49.5 L 31.5 49.5 Z"
        fill={isDark ? "#ffffff" : "#1e3a8a"}
        opacity="0.7"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="sunGradient" x1="32" y1="8" x2="32" y2="24">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <linearGradient id="pillarGradient" x1="18" y1="24" x2="46" y2="56">
          <stop offset="0%" stopColor={isDark ? "#60a5fa" : "#1e3a8a"} />
          <stop offset="100%" stopColor={isDark ? "#3b82f6" : "#1d4ed8"} />
        </linearGradient>

        <linearGradient id="arrowGradient" x1="18" y1="34" x2="46" y2="44">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>

        <linearGradient id="highlightGradient" x1="32" y1="30" x2="32" y2="38">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        <linearGradient id="starGradient" x1="29" y1="47" x2="35" y2="53">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ========================================
// FAVICON SVG EXPORT
// ========================================
export const FaviconSVG = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Simplified for small sizes -->
  <path d="M32 8 L32 24" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
  <path d="M22 12 L26 22" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M42 12 L38 22" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <rect x="18" y="24" width="6" height="32" rx="3" fill="url(#p)"/>
  <rect x="40" y="24" width="6" height="32" rx="3" fill="url(#p)"/>
  <path d="M 18 38 L 24 38 L 28 34 L 32 30 L 36 34 L 40 38 L 46 38 L 46 44 L 18 44 Z" fill="#2dd4bf"/>
  <circle cx="32" cy="50" r="3" fill="#f59e0b"/>
  <defs>
    <linearGradient id="p" x1="18" y1="24" x2="46" y2="56">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
</svg>`;

export default HorumarinLogo;
