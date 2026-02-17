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
  interactive?: boolean;
}

/**
 * MIDEEYE PREMIUM CARD COMPONENT
 *
 * Design principles:
 * - Premium elevation system with smooth transitions
 * - Subtle hover effects for interactivity
 * - Optional 3D tilt on mouse move
 * - Clean visual hierarchy
 * - Optimized for both light and dark modes
 */
export default function Card({
  children,
  hover = false,
  elevated = false,
  gradient = false,
  tilt = false,
  interactive = false,
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
        // Base styling - clean and minimal
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden",

        // Elevation system
        elevated
          ? "shadow-lg"
          : "shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]",

        // Gradient background option
        gradient &&
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",

        // Interactive hover effects with premium feel
        (hover || interactive) && [
          "transition-all duration-250 ease-out",
          "hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_6px_rgba(0,0,0,0.08)]",
          "hover:-translate-y-0.5",
          "hover:border-gray-300 dark:hover:border-gray-600",
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
