/**
 * useFollow Hook
 * Social graph management with optimistic UI
 */

import { useState, useEffect, useCallback } from "react";
import {
  followUser,
  unfollowUser,
  isFollowing as checkIsFollowing,
  getUserStats,
  type UserStats,
} from "@/services/follow.service";
import { useAuth } from "./useAuth";

interface UseFollowProps {
  userId: string;
}

export function useFollow({ userId }: UseFollowProps) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch follow status and stats
  const fetchData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    // Fetch both in parallel
    const [followResult, statsResult] = await Promise.all([
      user
        ? checkIsFollowing(userId)
        : Promise.resolve({ success: true, data: false }),
      getUserStats(userId),
    ]);

    if (followResult.success) {
      setFollowing(followResult.data || false);
    }

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }

    setLoading(false);
  }, [userId, user]);

  // Follow action (optimistic)
  const handleFollow = useCallback(async () => {
    if (!user || actionLoading) return;

    setActionLoading(true);

    // Optimistic update
    const previousFollowing = following;
    const previousStats = stats;

    setFollowing(true);
    if (stats) {
      setStats({
        ...stats,
        followers_count: stats.followers_count + 1,
      });
    }

    // Server update
    const result = await followUser(userId);

    if (!result.success) {
      // Rollback on error
      setFollowing(previousFollowing);
      setStats(previousStats);
    }

    setActionLoading(false);
  }, [user, userId, following, stats, actionLoading]);

  // Unfollow action (optimistic)
  const handleUnfollow = useCallback(async () => {
    if (!user || actionLoading) return;

    setActionLoading(true);

    // Optimistic update
    const previousFollowing = following;
    const previousStats = stats;

    setFollowing(false);
    if (stats) {
      setStats({
        ...stats,
        followers_count: Math.max(0, stats.followers_count - 1),
      });
    }

    // Server update
    const result = await unfollowUser(userId);

    if (!result.success) {
      // Rollback on error
      setFollowing(previousFollowing);
      setStats(previousStats);
    }

    setActionLoading(false);
  }, [user, userId, following, stats, actionLoading]);

  // Toggle follow/unfollow
  const toggleFollow = useCallback(() => {
    if (following) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  }, [following, handleFollow, handleUnfollow]);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    following,
    stats,
    loading,
    actionLoading,
    toggleFollow,
    follow: handleFollow,
    unfollow: handleUnfollow,
    refresh: fetchData,
  };
}

/**
 * useFollowButton Hook
 * Simplified hook for follow button component
 */
export function useFollowButton(userId: string) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !userId) return;

    const checkFollowing = async () => {
      const result = await checkIsFollowing(userId);
      if (result.success) {
        setIsFollowing(result.data || false);
      }
    };

    checkFollowing();
  }, [user, userId]);

  const toggle = useCallback(async () => {
    if (!user || loading) return;

    setLoading(true);
    const previousState = isFollowing;

    // Optimistic update
    setIsFollowing(!isFollowing);

    // Server update
    const result = isFollowing
      ? await unfollowUser(userId)
      : await followUser(userId);

    if (!result.success) {
      // Rollback
      setIsFollowing(previousState);
    }

    setLoading(false);
  }, [user, userId, isFollowing, loading]);

  return {
    isFollowing,
    loading,
    toggle,
    canFollow: user && user.id !== userId,
  };
}
