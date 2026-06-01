import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(150deg, #0D1B2A 0%, #0A0F1A 60%, #091018 100%)",
        borderRadius: "22.5%",
        position: "relative",
      }}
    >
      {/* Radial teal glow */}
      <div
        style={{
          position: "absolute",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,212,163,0.18) 0%, rgba(0,212,163,0.06) 50%, transparent 70%)",
        }}
      />
      {/* Gold accent glow — bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,182,46,0.12) 0%, transparent 70%)",
        }}
      />
      <svg width="120" height="120" viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4A3" />
            <stop offset="55%" stopColor="#00BA8D" />
            <stop offset="100%" stopColor="#FBB62E" />
          </linearGradient>
          <linearGradient id="ag2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0FAF4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFF8E6" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        {/* Outer 8-pointed star */}
        <path
          d="M24 2 L30 18 L46 24 L30 30 L24 46 L18 30 L2 24 L18 18 Z"
          fill="url(#ag)"
          opacity="0.96"
        />
        {/* Inner diamond highlight */}
        <path
          d="M24 16 L30 24 L24 32 L18 24 Z"
          fill="url(#ag2)"
          opacity="0.7"
        />
        {/* Center dot */}
        <circle cx="24" cy="24" r="2.5" fill="white" opacity="0.9" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
