import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0F1A",
        borderRadius: "24%",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="xg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4A3" />
            <stop offset="60%" stopColor="#00BA8D" />
            <stop offset="100%" stopColor="#FBB62E" />
          </linearGradient>
        </defs>
        {/* Outer 8-pointed star */}
        <path
          d="M24 2 L30 18 L46 24 L30 30 L24 46 L18 30 L2 24 L18 18 Z"
          fill="url(#xg)"
        />
        {/* Inner diamond highlight */}
        <path d="M24 16 L30 24 L24 32 L18 24 Z" fill="white" opacity="0.55" />
        {/* Center dot */}
        <circle cx="24" cy="24" r="2.5" fill="white" opacity="0.95" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
