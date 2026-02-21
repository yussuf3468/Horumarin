/**
 * FOLLOW SERVICE
 * Production-grade social graph for Mideeye
 *
 * Architecture:
 * - Optimistic UI support
 * - Cached stats for performance
 * - Simple recommendation engine
 * - No business logic in UI
 * - Ready for Django migration
 */

import { supabase } from "@/lib/supabase/client";

// =====================================================
// TYPES
// =====================================================

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  answers_count: number;
  updated_at: string;
}

export interface SuggestedFollow {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  mutual_count: number;
  reason: string;
}

export interface FollowUser {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_following: boolean;
  followed_at: string;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// =====================================================
// FOLLOW/UNFOLLOW
// =====================================================

/**
 * Follow a user
 * Uses optimistic UI pattern
 */
export async function followUser(
  userId: string,
): Promise<ServiceResponse<string>> {
  try {
    const { data, error } = await (supabase as any).rpc("follow_user", {
      p_following_id: userId,
    });

    if (error) throw error;

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error("Follow user error:", error);
    return {
      success: false,
      error: error.message || "Failed to follow user",
    };
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(
  userId: string,
): Promise<ServiceResponse<boolean>> {
  try {
    const { data, error } = await (supabase as any).rpc("unfollow_user", {
      p_following_id: userId,
    });

    if (error) throw error;

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error("Unfollow user error:", error);
    return {
      success: false,
      error: error.message || "Failed to unfollow user",
    };
  }
}

/**
 * Check if current user is following someone
 */
export async function isFollowing(
  userId: string,
): Promise<ServiceResponse<boolean>> {
  try {
    const { data, error } = await (supabase as any).rpc("is_following", {
      p_following_id: userId,
    });

    if (error) throw error;

    return {
      success: true,
      data: data || false,
    };
  } catch (error: any) {
    console.error("Is following error:", error);
    return {
      success: false,
      data: false,
      error: error.message,
    };
  }
}

/**
 * Check if mutual follow (both follow each other)
 */
export async function isMutualFollow(
  userId: string,
): Promise<ServiceResponse<boolean>> {
  try {
    const { data, error } = await (supabase as any).rpc("is_mutual_follow", {
      p_user_id: userId,
    });

    if (error) throw error;

    return {
      success: true,
      data: data || false,
    };
  } catch (error: any) {
    console.error("Is mutual follow error:", error);
    return {
      success: false,
      data: false,
      error: error.message,
    };
  }
}

// =====================================================
// FOLLOWERS & FOLLOWING
// =====================================================

/**
 * Get user's followers
 */
export async function getFollowers(params: {
  userId: string;
  limit?: number;
  offset?: number;
}): Promise<ServiceResponse<FollowUser[]>> {
  try {
    const { userId, limit = 20, offset = 0 } = params;

    const { data, error } = await (supabase as any).rpc("get_followers", {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Get followers error:", error);
    return {
      success: false,
      error: error.message || "Failed to get followers",
    };
  }
}

/**
 * Get users that the user is following
 */
export async function getFollowing(params: {
  userId: string;
  limit?: number;
  offset?: number;
}): Promise<ServiceResponse<FollowUser[]>> {
  try {
    const { userId, limit = 20, offset = 0 } = params;

    const { data, error } = await (supabase as any).rpc("get_following", {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Get following error:", error);
    return {
      success: false,
      error: error.message || "Failed to get following",
    };
  }
}

/**
 * Get mutual followers (people who follow both you and the target user)
 */
export async function getMutualFollowers(
  userId: string,
): Promise<
  ServiceResponse<
    Array<{
      user_id: string;
      full_name: string | null;
      avatar_url: string | null;
    }>
  >
> {
  try {
    const { data, error } = await (supabase as any).rpc(
      "get_mutual_followers",
      {
        p_user_id: userId,
      },
    );

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Get mutual followers error:", error);
    return {
      success: false,
      error: error.message || "Failed to get mutual followers",
    };
  }
}

// =====================================================
// STATS
// =====================================================

/**
 * Get user statistics
 */
export async function getUserStats(
  userId: string,
): Promise<ServiceResponse<UserStats>> {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If no stats exist, return zeros
      if (error.code === "PGRST116") {
        return {
          success: true,
          data: {
            user_id: userId,
            followers_count: 0,
            following_count: 0,
            posts_count: 0,
            answers_count: 0,
            updated_at: new Date().toISOString(),
          },
        };
      }
      throw error;
    }

    return {
      success: true,
      data: data as UserStats,
    };
  } catch (error: any) {
    console.error("Get user stats error:", error);
    return {
      success: false,
      error: error.message || "Failed to get user stats",
    };
  }
}

/**
 * Recalculate user stats (admin/maintenance function)
 */
export async function recalculateUserStats(
  userId: string,
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("recalculate_user_stats", {
      p_user_id: userId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Recalculate stats error:", error);
    return {
      success: false,
      error: error.message || "Failed to recalculate stats",
    };
  }
}

// =====================================================
// SUGGESTIONS
// =====================================================

/**
 * Get suggested users to follow
 * Algorithm: Users followed by people you follow
 */
export async function getSuggestedFollows(
  limit: number = 10,
): Promise<ServiceResponse<SuggestedFollow[]>> {
  try {
    const { data, error } = await (supabase as any).rpc(
      "get_suggested_follows",
      {
        p_limit: limit,
      },
    );

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Get suggested follows error:", error);
    return {
      success: false,
      error: error.message || "Failed to get suggestions",
    };
  }
}

// =====================================================
// BULK OPERATIONS
// =====================================================

/**
 * Get following status for multiple users
 * Useful for rendering follow buttons in lists
 */
export async function getBulkFollowingStatus(
  userIds: string[],
): Promise<ServiceResponse<Record<string, boolean>>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", user.id)
      .in("following_id", userIds);

    if (error) throw error;

    // Convert to map
    const statusMap: Record<string, boolean> = {};
    userIds.forEach((id) => {
      statusMap[id] = false;
    });
    (data || []).forEach((follow: any) => {
      statusMap[follow.following_id] = true;
    });

    return {
      success: true,
      data: statusMap,
    };
  } catch (error: any) {
    console.error("Get bulk following status error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get follower counts for multiple users
 */
export async function getBulkFollowerCounts(
  userIds: string[],
): Promise<ServiceResponse<Record<string, number>>> {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("user_id, followers_count")
      .in("user_id", userIds);

    if (error) throw error;

    // Convert to map
    const countMap: Record<string, number> = {};
    userIds.forEach((id) => {
      countMap[id] = 0;
    });
    (data || []).forEach((stat: any) => {
      countMap[stat.user_id] = stat.followers_count;
    });

    return {
      success: true,
      data: countMap,
    };
  } catch (error: any) {
    console.error("Get bulk follower counts error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

/**
 * Subscribe to follow events for a user
 * Get notified when someone follows/unfollows
 */
export function subscribeToFollowEvents(
  userId: string,
  callback: (event: "follow" | "unfollow", followerId: string) => void,
): () => void {
  const subscription = supabase
    .channel(`follows:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "user_follows",
        filter: `following_id=eq.${userId}`,
      },
      (payload) => {
        callback("follow", (payload.new as any).follower_id);
      },
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "user_follows",
        filter: `following_id=eq.${userId}`,
      },
      (payload) => {
        callback("unfollow", (payload.old as any).follower_id);
      },
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format follower count for display
 */
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Get follow button text
 */
export function getFollowButtonText(
  isFollowing: boolean,
  isMutual: boolean,
): string {
  if (isMutual) return "Following";
  if (isFollowing) return "Following";
  return "Follow";
}

/**
 * Get mutual follow status text
 */
export function getMutualFollowText(isMutual: boolean): string {
  return isMutual ? "Follows you" : "";
}
