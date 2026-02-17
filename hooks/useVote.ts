/**
 * useVote Hook - Optimistic UI for Voting
 *
 * Provides instant feedback for voting actions with smooth animations
 * and automatic rollback on error.
 */

import { useState, useCallback } from "react";
import { castVote, removeVote, VotableType } from "@/services/vote.service";
import { useToast } from "./useToast";

interface UseVoteProps {
  votableId: string;
  votableType: VotableType;
  initialVoteCount: number;
  initialUserVote: number | null; // 1, -1, or null
  userId: string | null;
}

interface UseVoteReturn {
  voteCount: number;
  userVote: number | null;
  isVoting: boolean;
  handleUpvote: () => Promise<void>;
  handleDownvote: () => Promise<void>;
  animationState: "idle" | "upvote" | "downvote";
}

export function useVote({
  votableId,
  votableType,
  initialVoteCount,
  initialUserVote,
  userId,
}: UseVoteProps): UseVoteReturn {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<number | null>(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);
  const [animationState, setAnimationState] = useState<
    "idle" | "upvote" | "downvote"
  >("idle");
  const toast = useToast();

  const handleVote = useCallback(
    async (voteValue: number) => {
      if (!userId) {
        toast.error("Please login to vote");
        return;
      }

      if (isVoting) return;

      setIsVoting(true);
      setAnimationState(voteValue === 1 ? "upvote" : "downvote");

      // Optimistic update
      const previousVote = userVote;
      const previousCount = voteCount;

      let newCount = voteCount;
      let newVote: number | null = voteValue;

      // Calculate new vote count based on previous state
      if (previousVote === voteValue) {
        // Remove vote (clicking same button again)
        newCount = voteCount - voteValue;
        newVote = null;
      } else if (previousVote === null) {
        // New vote
        newCount = voteCount + voteValue;
      } else {
        // Change vote (upvote to downvote or vice versa)
        newCount = voteCount + voteValue * 2;
      }

      setVoteCount(newCount);
      setUserVote(newVote);

      try {
        let result;

        if (newVote === null) {
          // Remove vote
          result = await removeVote(userId, votableId, votableType);
        } else {
          // Cast vote
          result = await castVote({
            userId,
            votableId,
            votableType,
            value: voteValue,
          });
        }

        if (!result.success) {
          throw new Error(result.error || "Failed to vote");
        }

        // Success - animation will clear after timeout
        setTimeout(() => {
          setAnimationState("idle");
        }, 300);
      } catch (error) {
        // Rollback on error
        setVoteCount(previousCount);
        setUserVote(previousVote);
        setAnimationState("idle");
        toast.error("Failed to vote. Please try again.");
      } finally {
        setIsVoting(false);
      }
    },
    [userId, userVote, voteCount, votableId, votableType, isVoting, toast],
  );

  const handleUpvote = useCallback(() => handleVote(1), [handleVote]);
  const handleDownvote = useCallback(() => handleVote(-1), [handleVote]);

  return {
    voteCount,
    userVote,
    isVoting,
    handleUpvote,
    handleDownvote,
    animationState,
  };
}
