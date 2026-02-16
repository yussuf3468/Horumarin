"use client";

import { forwardRef, ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/helpers";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-primary-600 to-accent-600 text-primary-fg hover:from-primary-700 hover:to-accent-700 focus:ring-primary-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-surface-muted text-foreground hover:bg-surface-elevated focus:ring-primary-500 border border-border hover:border-border-strong",
      outline:
        "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:border-primary-700",
      ghost:
        "text-foreground-muted hover:bg-surface-muted hover:text-foreground focus:ring-primary-500",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md active:bg-red-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileHover={{
          scale: disabled || isLoading ? 1 : 1.02,
        }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
