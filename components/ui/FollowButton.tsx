/**
 * FollowButton Component
 * Premium follow/unfollow button with optimistic UI
 */

"use client";

import { motion } from "framer-motion";
import { useFollowButton } from "@/hooks/useFollow";
import { cn } from "@/utils/helpers";

interface FollowButtonProps {
  userId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showMutual?: boolean;
  className?: string;
}

export default function FollowButton({
  userId,
  variant = "default",
  size = "md",
  showMutual = false,
  className,
}: FollowButtonProps) {
  const { isFollowing, loading, toggle, canFollow } = useFollowButton(userId);

  if (!canFollow) return null;

  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    default: isFollowing
      ? "bg-surface-muted text-foreground border border-border hover:bg-surface-muted/80"
      : "bg-primary text-primary-fg hover:bg-primary-600",
    outline: isFollowing
      ? "bg-transparent text-foreground border border-border hover:bg-surface-muted"
      : "bg-transparent text-primary border border-primary hover:bg-primary/10",
    ghost: isFollowing
      ? "bg-transparent text-foreground hover:bg-surface-muted"
      : "bg-transparent text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      onClick={toggle}
      disabled={loading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="hidden sm:inline">
            {isFollowing ? "Unfollowing..." : "Following..."}
          </span>
        </span>
      ) : (
        <>
          {isFollowing ? (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Following
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Follow
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}

/**
 * FollowButtonCompact Component
 * Minimal follow button for tight spaces
 */
export function FollowButtonCompact({ userId }: { userId: string }) {
  const { isFollowing, loading, toggle, canFollow } = useFollowButton(userId);

  if (!canFollow) return null;

  return (
    <motion.button
      onClick={toggle}
      disabled={loading}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        isFollowing
          ? "bg-surface-muted text-foreground border border-border"
          : "bg-primary text-primary-fg"
      )}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isFollowing ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      )}
    </motion.button>
  );
}
