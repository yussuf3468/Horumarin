"use client";

import { forwardRef, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/helpers";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

    const base = "inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none rounded-xl";

    const variants = {
      primary:
        "bg-primary text-primary-fg hover:bg-primary-400 focus:ring-primary/40 shadow-glow-teal-sm hover:shadow-glow-teal",
      secondary:
        "bg-surface-elevated text-foreground hover:bg-surface-muted border border-border hover:border-border-strong focus:ring-primary/30",
      outline:
        "border-2 border-border text-foreground-muted hover:border-primary/50 hover:text-primary-400 hover:bg-primary/5 focus:ring-primary/30",
      ghost:
        "text-foreground-muted hover:text-foreground hover:bg-surface-muted focus:ring-primary/30",
      danger:
        "bg-danger text-white hover:brightness-110 focus:ring-danger/40 shadow-sm",
      gold:
        "bg-accent text-accent-fg hover:brightness-105 focus:ring-accent/40 shadow-sm",
    };

    const sizes = {
      sm:   "px-3 py-1.5 text-sm gap-1.5",
      md:   "px-4 py-2 text-sm gap-2",
      lg:   "px-6 py-3 text-base gap-2",
      icon: "p-2",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
        whileTap={  { scale: disabled || isLoading ? 1 : 0.97  }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="opacity-70">{children}</span>
          </>
        ) : children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
