/**
 * Vote Service
 *
 * This layer abstracts all voting operations from Supabase.
 * When migrating to Django REST API, replace with:
 * - POST /api/questions/:id/vote
 * - POST /api/answers/:id/vote
 * - DELETE /api/votes/:id
 */

import { supabase } from "@/lib/supabase/client";

export type VotableType = "question" | "answer";

export interface VoteData {
  userId: string;
  votableId: string;
  votableType: VotableType;
  value: number; // 1 for upvote, -1 for downvote
}

/**
 * Cast a vote (upvote or downvote)
 * Migration note: Replace with POST /api/:type/:id/vote
 * Django would handle upsert logic server-side
 */
export async function castVote(
  data: VoteData,
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", data.userId)
      .eq("votable_id", data.votableId)
      .eq("votable_type", data.votableType)
      .single();

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from("votes")
        .update({ value: data.value })
        .eq("id", existingVote.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Create new vote
      const { error } = await supabase.from("votes").insert([
        {
          user_id: data.userId,
          votable_id: data.votableId,
          votable_type: data.votableType,
          value: data.value,
        },
      ]);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Remove a vote
 * Migration note: Replace with DELETE /api/votes/:id
 */
export async function removeVote(
  userId: string,
  votableId: string,
  votableType: VotableType,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", userId)
      .eq("votable_id", votableId)
      .eq("votable_type", votableType);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get vote count for a votable item
 * Migration note: Replace with GET /api/:type/:id/votes
 * Django would aggregate this server-side
 */
export async function getVoteCount(
  votableId: string,
  votableType: VotableType,
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("votes")
      .select("value")
      .eq("votable_id", votableId)
      .eq("votable_type", votableType);

    if (error || !data) return 0;

    return data.reduce((sum, vote) => sum + vote.value, 0);
  } catch (error) {
    return 0;
  }
}

/**
 * Get vote counts for multiple items
 * Migration note: This would be aggregated server-side in Django
 */
export async function getVoteCountsForItems(
  votableType: VotableType,
  votableIds: string[],
): Promise<Record<string, number>> {
  if (votableIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from("votes")
      .select("votable_id, value")
      .eq("votable_type", votableType)
      .in("votable_id", votableIds);

    if (error || !data) return {};

    return data.reduce<Record<string, number>>((acc, vote) => {
      acc[vote.votable_id] = (acc[vote.votable_id] || 0) + vote.value;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
}

/**
 * Get user's vote for a specific item
 * Migration note: Part of GET /api/:type/:id response in Django
 */
export async function getUserVote(
  userId: string,
  votableId: string,
  votableType: VotableType,
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("votes")
      .select("value")
      .eq("user_id", userId)
      .eq("votable_id", votableId)
      .eq("votable_type", votableType)
      .single();

    if (error || !data) return null;

    return data.value;
  } catch (error) {
    return null;
  }
}

/**
 * Get user's votes for multiple items
 * Migration note: This would be part of the feed payload in Django
 */
export async function getUserVotesForItems(
  userId: string,
  votableType: VotableType,
  votableIds: string[],
): Promise<Record<string, number>> {
  if (votableIds.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from("votes")
      .select("votable_id, value")
      .eq("user_id", userId)
      .eq("votable_type", votableType)
      .in("votable_id", votableIds);

    if (error || !data) return {};

    return data.reduce<Record<string, number>>((acc, vote) => {
      acc[vote.votable_id] = vote.value;
      return acc;
    }, {});
  } catch (error) {
    return {};
  }
}
