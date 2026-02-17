/**
 * VoteButton Component - Premium Voting Experience
 *
 * Features:
 * - Smooth scale animations on click
 * - Color transitions
 * - Optimistic UI updates
 * - Visual feedback for active state
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  type: "upvote" | "downvote";
  count: number;
  isActive: boolean;
  isAnimating: boolean;
  onClick: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function VoteButton({
  type,
  count,
  isActive,
  isAnimating,
  onClick,
  disabled = false,
  compact = false,
}: VoteButtonProps) {
  const isUpvote = type === "upvote";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        compact ? "flex-row" : "flex-col",
      )}
    >
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative rounded-lg p-2 transition-all duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isActive &&
            isUpvote &&
            "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
          isActive &&
            !isUpvote &&
            "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
          !isActive && "text-gray-500 dark:text-gray-400",
        )}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        animate={
          isAnimating
            ? {
                scale: [1, 1.2, 1],
                rotate: isUpvote ? [0, -15, 0] : [0, 15, 0],
              }
            : {}
        }
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        {isUpvote ? (
          <svg
            className="w-5 h-5"
            fill={isActive ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={isActive ? 0 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill={isActive ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={isActive ? 0 : 2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: isUpvote ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isUpvote ? -10 : 10 }}
          className={cn(
            "text-sm font-semibold min-w-[2rem] text-center",
            isActive && isUpvote && "text-orange-600 dark:text-orange-400",
            isActive && !isUpvote && "text-blue-600 dark:text-blue-400",
            !isActive && "text-gray-700 dark:text-gray-300",
          )}
        >
          {count > 0 ? "+" : ""}
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Combined Vote Controls - Upvote/Downvote together
 */
interface VoteControlsProps {
  voteCount: number;
  userVote: number | null;
  onUpvote: () => void;
  onDownvote: () => void;
  isVoting: boolean;
  animationState: "idle" | "upvote" | "downvote";
  layout?: "vertical" | "horizontal";
  compact?: boolean;
}

export function VoteControls({
  voteCount,
  userVote,
  onUpvote,
  onDownvote,
  isVoting,
  animationState,
  layout = "vertical",
  compact = false,
}: VoteControlsProps) {
  const containerClasses = cn(
    "flex items-center gap-1",
    layout === "vertical" ? "flex-col" : "flex-row",
  );

  return (
    <div className={containerClasses}>
      {/* Upvote Button */}
      <VoteButton
        type="upvote"
        count={voteCount}
        isActive={userVote === 1}
        isAnimating={animationState === "upvote"}
        onClick={onUpvote}
        disabled={isVoting}
        compact={compact}
      />

      {/* Downvote Button (optional - can be hidden for simpler UI) */}
      {/* Uncomment if you want downvote functionality */}
      {/* <VoteButton
        type="downvote"
        count={voteCount}
        isActive={userVote === -1}
        isAnimating={animationState === 'downvote'}
        onClick={onDownvote}
        disabled={isVoting}
        compact={compact}
      /> */}
    </div>
  );
}
