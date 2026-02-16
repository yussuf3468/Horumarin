/**
 * User Service
 *
 * This layer abstracts all user/profile operations from Supabase.
 * When migrating to Django REST API, replace Supabase calls with:
 * - GET /api/users/:id
 * - PUT /api/users/:id
 * - etc.
 */

import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

/**
 * Get a user profile by ID
 * Migration note: Replace with GET /api/users/:id
 */
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Update user profile
 * Migration note: Replace with PUT /api/users/:id
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateProfileData,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user statistics
 * Migration note: Replace with GET /api/users/:id/stats
 */
export async function getUserStats(userId: string): Promise<{
  questionsAsked: number;
  answersGiven: number;
  totalVotes: number;
}> {
  try {
    // Fetch questions count
    const { count: questionsCount } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Fetch answers count
    const { count: answersCount } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Fetch votes received (this would be aggregated in Django)
    const { count: votesCount } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    return {
      questionsAsked: questionsCount || 0,
      answersGiven: answersCount || 0,
      totalVotes: votesCount || 0,
    };
  } catch (error) {
    return {
      questionsAsked: 0,
      answersGiven: 0,
      totalVotes: 0,
    };
  }
}

/**
 * Get user reputation score (votes received on posts and answers)
 * Migration note: Replace with GET /api/users/:id/reputation
 */
export async function getUserReputation(userId: string): Promise<number> {
  try {
    const { data: questionIds } = await supabase
      .from("questions")
      .select("id")
      .eq("user_id", userId);

    const { data: answerIds } = await supabase
      .from("answers")
      .select("id")
      .eq("user_id", userId);

    const questionIdList = (questionIds || []).map((row) => row.id);
    const answerIdList = (answerIds || []).map((row) => row.id);

    let total = 0;

    if (questionIdList.length > 0) {
      const { data: questionVotes } = await supabase
        .from("votes")
        .select("value")
        .eq("votable_type", "question")
        .in("votable_id", questionIdList);

      total += (questionVotes || []).reduce((sum, vote) => sum + vote.value, 0);
    }

    if (answerIdList.length > 0) {
      const { data: answerVotes } = await supabase
        .from("votes")
        .select("value")
        .eq("votable_type", "answer")
        .in("votable_id", answerIdList);

      total += (answerVotes || []).reduce((sum, vote) => sum + vote.value, 0);
    }

    return total;
  } catch (error) {
    return 0;
  }
}
