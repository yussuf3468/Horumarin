import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1d4ed8 0%, #0d9488 100%)",
        borderRadius: "22.5%",
      }}
    >
      <svg
        width="160"
        height="160"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Book base */}
        <path
          d="M4 18 C4 18, 4 24, 4 26 C4 28, 6 30, 8 30 L24 30 C26 30, 28 28, 28 26 L28 18 Z"
          fill="#60a5fa"
        />

        {/* Center ray of light */}
        <path
          d="M16 4 L16 14"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Star of knowledge */}
        <circle cx="16" cy="15" r="4" fill="#3b82f6" />
        <path
          d="M16 12 L16.8 14.5 L19 14.5 L17.2 16 L18 18.5 L16 17 L14 18.5 L14.8 16 L13 14.5 L15.2 14.5 Z"
          fill="white"
          opacity="0.9"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
