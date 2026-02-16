"use client";

import { ReactNode } from "react";
import {
  motion,
  type HTMLMotionProps,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/utils/helpers";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  hover?: boolean;
  elevated?: boolean;
  gradient?: boolean;
  tilt?: boolean;
}

/**
 * MIDEEYE CARD COMPONENT - SEMANTIC COLOR SYSTEM
 *
 * Design principles:
 * - Uses semantic color tokens for proper contrast
 * - Strong contrast with subtle shadow
 * - Hover depth effect for interactivity
 * - Optional 3D tilt on mouse move
 * - Tighter internal padding
 * - Background gradient option for visual richness
 * - Clear interaction affordance
 */
export default function Card({
  children,
  hover = false,
  elevated = false,
  gradient = false,
  tilt = false,
  className,
  ...props
}: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn(
        // LOCKED: Base styling - semantic colors ONLY (no hardcoded colors allowed)
        "bg-surface-elevated text-foreground rounded-lg border border-border overflow-hidden",

        // Shadow system - proper depth
        elevated ? "shadow-elevated" : "shadow-card",

        // Gradient background option (semantic only)
        gradient && "bg-gradient-card",

        // Hover effects - clear interactivity with semantic colors ONLY
        hover && [
          "transition-all duration-200",
          "hover:shadow-card-hover hover:-translate-y-1",
          "hover:border-border-strong",
          "cursor-pointer",
        ],

        className,
      )}
      style={
        tilt
          ? {
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
