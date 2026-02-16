/**
 * SPINNER COMPONENT
 * Loading spinner indicator
 */

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "accent" | "current";
  className?: string;
}

export default function Spinner({
  size = "md",
  variant = "primary",
  className,
}: SpinnerProps) {
  const sizeClasses = {
    xs: "w-3 h-3 border",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
    xl: "w-12 h-12 border-4",
  };

  const variantClasses = {
    primary:
      "border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400",
    accent:
      "border-accent-200 dark:border-accent-800 border-t-accent-600 dark:border-t-accent-400",
    current: "border-current/20 border-t-current",
  };

  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
