/**
 * FLOATING ABSTRACT SHAPES
 * Subtle, cinematic background elements for hero sections
 */

"use client";

import React from "react";

export const FloatingShapes: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gradient orb - top right */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, transparent 70%)",
          animation: "float 20s ease-in-out infinite",
        }}
      />

      {/* Medium orb - bottom left */}
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)",
          animation: "float 25s ease-in-out infinite reverse",
          animationDelay: "2s",
        }}
      />

      {/* Small accent orb - center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)",
          animation: "pulse 15s ease-in-out infinite",
        }}
      />

      {/* Abstract ring shapes */}
      <div
        className="absolute top-20 right-1/4 w-40 h-40 rounded-full border-2 border-border/40 blur-sm"
        style={{
          animation: "rotate 30s linear infinite",
        }}
      />

      <div
        className="absolute bottom-40 left-1/3 w-32 h-32 rounded-full border-2 border-accent-400/10 blur-sm"
        style={{
          animation: "rotate 25s linear infinite reverse",
          animationDelay: "3s",
        }}
      />

      {/* Subtle stars */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-foreground/15 rounded-full blur-[0.5px]" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-foreground/10 rounded-full blur-[0.5px]" />
      <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-accent-300/30 rounded-full blur-[0.5px]" />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, 20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.15;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingShapes;
