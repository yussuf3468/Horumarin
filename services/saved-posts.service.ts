/**
 * Saved Posts Service
 *
 * This layer abstracts all saved posts operations from Supabase.
 * When migrating to Django REST API, replace with:
 * - POST /api/posts/:id/save
 * - DELETE /api/posts/:id/unsave
 * - GET /api/users/:id/saved-posts
 */

import { supabase } from "@/lib/supabase/client";
import type { Question } from "@/types";

export interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  savedAt: string;
}

/**
 * Save a post for later
 * Migration note: Replace with POST /api/posts/:id/save
 */
export async function savePost(
  userId: string,
  postId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any).from("saved_posts").insert([
      {
        user_id: userId,
        post_id: postId,
      },
    ]);

    if (error) {
      // Check if it's a duplicate error
      if (error.code === "23505") {
        return { success: true, error: null };
      }
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Unsave a post
 * Migration note: Replace with DELETE /api/posts/:id/unsave
 */
export async function unsavePost(
  userId: string,
  postId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("saved_posts")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if a post is saved by the user
 * Migration note: Replace with GET /api/posts/:id/is-saved
 */
export async function isPostSaved(
  userId: string,
  postId: string,
): Promise<boolean> {
  try {
    const { data, error } = await (supabase as any)
      .from("saved_posts")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Get all saved posts for a user with full post details
 * Migration note: Replace with GET /api/users/:id/saved-posts
 */
export async function getSavedPosts(
  userId: string,
  limit: number = 20,
  offset: number = 0,
): Promise<{ posts: Question[]; error: string | null }> {
  try {
    const { data, error } = await (supabase as any)
      .from("saved_posts")
      .select(
        `
        saved_at,
        questions (
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        )
      `,
      )
      .eq("user_id", userId)
      .order("saved_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { posts: [], error: error.message };
    }

    // Transform data to match Question type
    const posts: Question[] = (data || []).map((item: any) => ({
      id: item.questions.id,
      userId: item.questions.user_id,
      title: item.questions.title,
      content: item.questions.content,
      postType: item.questions.post_type,
      category: item.questions.category,
      imageVideoUrl: item.questions.image_video_url,
      linkUrl: item.questions.link_url,
      voteCount: item.questions.vote_count,
      commentCount: item.questions.comment_count,
      viewCount: item.questions.view_count,
      isAnswered: item.questions.is_answered,
      createdAt: item.questions.created_at,
      updatedAt: item.questions.updated_at,
      author: {
        id: item.questions.profiles?.id || "",
        fullName: item.questions.profiles?.full_name || null,
        email: item.questions.profiles?.email || "",
        avatar_url: item.questions.profiles?.avatar_url || null,
      },
    }));

    return { posts, error: null };
  } catch (error: any) {
    return { posts: [], error: error.message };
  }
}

/**
 * Get saved post count for a user
 * Migration note: Replace with GET /api/users/:id/saved-posts/count
 */
export async function getSavedPostCount(userId: string): Promise<number> {
  try {
    const { count, error } = await (supabase as any)
      .from("saved_posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      return 0;
    }

    return count || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Get multiple saved states at once (for feed optimization)
 * Migration note: Replace with POST /api/posts/check-saved (with array of post IDs)
 */
export async function checkMultipleSavedPosts(
  userId: string,
  postIds: string[],
): Promise<Record<string, boolean>> {
  try {
    const { data, error } = await (supabase as any)
      .from("saved_posts")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds);

    if (error) {
      return {};
    }

    const savedMap: Record<string, boolean> = {};
    postIds.forEach((id) => (savedMap[id] = false));

    (data || []).forEach((item: any) => {
      savedMap[item.post_id] = true;
    });

    return savedMap;
  } catch (error) {
    return {};
  }
}
