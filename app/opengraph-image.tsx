import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MIDEEYE — The Somali Knowledge Network";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0F1A",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Top-left teal glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,212,163,0.22) 0%, rgba(0,212,163,0.06) 50%, transparent 70%)",
        }}
      />
      {/* Bottom-right gold glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-60px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,182,46,0.18) 0%, rgba(251,182,46,0.04) 50%, transparent 70%)",
        }}
      />
      {/* Subtle grid lines — horizontal */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          backgroundImage:
            "linear-gradient(rgba(0,212,163,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,163,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ─── MAIN CONTENT ─── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          gap: "0px",
        }}
      >
        {/* Xiddig star mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            borderRadius: "28px",
            background: "rgba(0,212,163,0.08)",
            border: "1px solid rgba(0,212,163,0.2)",
            marginBottom: "36px",
            boxShadow: "0 0 80px rgba(0,212,163,0.25)",
          }}
        >
          <svg width="60" height="60" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D4A3" />
                <stop offset="55%" stopColor="#00BA8D" />
                <stop offset="100%" stopColor="#FBB62E" />
              </linearGradient>
              <linearGradient id="og2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0FAF4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFF8E6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d="M24 2 L30 18 L46 24 L30 30 L24 46 L18 30 L2 24 L18 18 Z"
              fill="url(#og)"
              opacity="0.96"
            />
            <path
              d="M24 16 L30 24 L24 32 L18 24 Z"
              fill="url(#og2)"
              opacity="0.7"
            />
            <circle cx="24" cy="24" r="2.5" fill="white" opacity="0.9" />
          </svg>
        </div>

        {/* MIDEEYE wordmark */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 900,
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: "20px",
            background:
              "linear-gradient(90deg, #00D4A3 0%, #00C899 40%, #FBB62E 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          MIDEEYE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(148,163,184,0.85)",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: 400,
            marginBottom: "52px",
          }}
        >
          The Somali Knowledge Network
        </div>

        {/* Divider */}
        <div
          style={{
            width: "480px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,163,0.35), rgba(251,182,46,0.25), transparent)",
            marginBottom: "44px",
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "56px",
          }}
        >
          {[
            { value: "12,400+", label: "Questions" },
            { value: "8,200+", label: "Members" },
            { value: "31", label: "Countries" },
            { value: "24", label: "Topics" },
          ].map(({ value, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#00D4A3",
                  letterSpacing: "-0.5px",
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(148,163,184,0.6)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom URL badge */}
      <div
        style={{
          position: "absolute",
          bottom: "36px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(100,116,139,0.7)",
          fontSize: "16px",
          letterSpacing: "1.5px",
        }}
      >
        mideeye.com
      </div>
    </div>,
    { ...size },
  );
}
