/**
 * SaveButton Component - Bookmark Posts with Animation
 *
 * Features:
 * - Smooth fill animation
 * - Optimistic UI
 * - Visual feedback
 * - Compact and inline variants
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { savePost, unsavePost } from "@/services/saved-posts.service";
import { useToast } from "@/hooks/useToast";

interface SaveButtonProps {
  postId: string;
  userId: string | null;
  initialSaved: boolean;
  variant?: "default" | "compact" | "inline";
  onToggle?: (isSaved: boolean) => void;
}

export default function SaveButton({
  postId,
  userId,
  initialSaved,
  variant = "default",
  onToggle,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleToggle = useCallback(async () => {
    if (!userId) {
      toast.error("Please login to save posts");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);

    try {
      const result = !isSaved
        ? await savePost(userId, postId)
        : await unsavePost(userId, postId);

      if (!result.success) {
        throw new Error(result.error || "Failed to save post");
      }

      onToggle?.(!isSaved);
      toast.success(!isSaved ? "Post saved!" : "Post removed from saved");
    } catch (error) {
      // Rollback on error
      setIsSaved(previousState);
      toast.error("Failed to save post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, postId, isSaved, isLoading, onToggle, toast]);

  if (variant === "compact") {
    return (
      <motion.button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "p-2 rounded-lg transition-colors disabled:opacity-50",
          isSaved
            ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700",
        )}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <AnimatePresence mode="wait">
          <motion.svg
            key={isSaved ? "saved" : "unsaved"}
            className="w-5 h-5"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={isSaved ? 0 : 2}
            initial={{ scale: 0.8, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, rotate: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </motion.svg>
        </AnimatePresence>
      </motion.button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50",
          isSaved
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400",
        )}
      >
        <motion.svg
          className="w-4 h-4"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isSaved ? 0 : 2}
          animate={isSaved ? { scale: [1, 1.2, 1], rotate: [0, -10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </motion.svg>
        {isSaved ? "Saved" : "Save"}
      </button>
    );
  }

  // Default button variant
  return (
    <motion.button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50",
        isSaved
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      <AnimatePresence mode="wait">
        <motion.svg
          key={isSaved ? "saved" : "unsaved"}
          className="w-5 h-5"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isSaved ? 0 : 2}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </motion.svg>
      </AnimatePresence>
      {isSaved ? "Saved" : "Save for Later"}
    </motion.button>
  );
}
