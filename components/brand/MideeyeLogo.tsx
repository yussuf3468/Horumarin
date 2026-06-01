/**
 * MIDEEYE LOGO — XIDDIG (STAR) MARK
 *
 * Concept: A crystalline 8-pointed geometric star formed by two
 * overlapping diamonds — referencing Islamic/Somali geometric art,
 * the Somali national star, and the idea of light radiating outward
 * (knowledge illuminating the community).
 *
 * The mark is clean, modern, and works at any size.
 * Teal-to-Gold gradient = Ocean-to-Sun = the Somali horizon.
 */

import React from "react";

// ========================================
// PRIMARY LOGO — ICON + WORDMARK
// ========================================
export const MideeyeLogo: React.FC<{
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}> = ({ className = "", size = "md", variant = "light" }) => {
  const sizes = {
    sm: { icon: 28, wordmark: 16, tagline: 9 },
    md: { icon: 36, wordmark: 20, tagline: 10 },
    lg: { icon: 48, wordmark: 26, tagline: 11 },
  };

  const s = sizes[size];
  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={s.icon} variant={variant} />
      <div className="flex flex-col justify-center" style={{ gap: "1px" }}>
        <span
          style={{
            fontSize: `${s.wordmark}px`,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontFamily: "var(--font-heading), 'Plus Jakarta Sans', sans-serif",
            background: isDark
              ? "linear-gradient(135deg, #00D4A3 0%, #FBB62E 100%)"
              : "linear-gradient(135deg, #00925A 0%, #D97706 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          MIDEEYE
        </span>
        {size !== "sm" && (
          <span
            style={{
              fontSize: `${s.tagline}px`,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 500,
              lineHeight: 1,
              color: isDark ? "rgba(152,170,202,0.9)" : "rgba(68,85,110,0.8)",
              fontFamily: "var(--font-body), 'Inter', sans-serif",
            }}
          >
            Knowledge Network
          </span>
        )}
      </div>
    </div>
  );
};

// ========================================
// LOGO ICON — CRYSTALLINE STAR
// ========================================
export const LogoIcon: React.FC<{
  size?: number;
  variant?: "light" | "dark";
  className?: string;
}> = ({ size = 36, variant = "light", className = "" }) => {
  const id = `xiddig-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MIDEEYE"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00D4A3" />
          <stop offset="50%"  stopColor="#00BA8D" />
          <stop offset="100%" stopColor="#FBB62E" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#E0FAF4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFF8E6" stopOpacity="0.7" />
        </linearGradient>
        <filter id={`${id}-glow`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer 8-pointed star: two overlapping rotated squares */}
      <path
        d="M24 2 L30 18 L46 24 L30 30 L24 46 L18 30 L2 24 L18 18 Z"
        fill={`url(#${id}-grad)`}
        opacity="0.95"
      />

      {/* Inner diamond highlight */}
      <path
        d="M24 16 L30 24 L24 32 L18 24 Z"
        fill={`url(#${id}-inner)`}
        opacity="0.7"
      />

      {/* Center dot */}
      <circle cx="24" cy="24" r="2.5" fill="white" opacity="0.85" />
    </svg>
  );
};

export default MideeyeLogo;