import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "MIDEEYE — Weydii. Wadaag. Horumar.";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f1117 0%, #0d1f3c 50%, #042f2e 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark ring */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, #1d4ed8, #0d9488)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            boxShadow: "0 0 60px rgba(13,148,136,0.4)",
          }}
        >
          {/* Simple eye / knowledge icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 38% 38%, #93c5fd, #2dd4bf)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#0f1117",
              }}
            />
          </div>
        </div>

        {/* App name */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: 900,
            letterSpacing: "-2px",
            background: "linear-gradient(90deg, #ffffff 0%, #2dd4bf 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "16px",
          }}
        >
          MIDEEYE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "#94a3b8",
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Weydii · Wadaag · Horumar
        </div>

        {/* Descriptor pill */}
        <div
          style={{
            paddingLeft: "28px",
            paddingRight: "28px",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderRadius: "100px",
            border: "1px solid rgba(45,212,191,0.3)",
            background: "rgba(45,212,191,0.08)",
            color: "#2dd4bf",
            fontSize: "20px",
            letterSpacing: "1px",
          }}
        >
          The Somali Knowledge Community
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            color: "#475569",
            fontSize: "18px",
            letterSpacing: "1px",
          }}
        >
          mideeye.com
        </div>
      </div>
    ),
    { ...size }
  );
}
