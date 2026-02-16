/**
 * Question Service
 *
 * This layer abstracts all question operations from Supabase.
 * When migrating to Django REST API, replace Supabase calls with:
 * - GET /api/questions
 * - POST /api/questions
 * - GET /api/questions/:id
 * - PUT /api/questions/:id
 * - DELETE /api/questions/:id
 */

import { supabase } from "@/lib/supabase/client";
import type { Question } from "@/types";

export interface QuestionData {
  title: string;
  content: string;
  category: string;
  userId: string;
  postType?: "question" | "discussion" | "media" | "resource" | "announcement";
  imageVideoUrl?: string | null;
  linkUrl?: string | null;
}

export interface QuestionWithAuthor extends Question {
  author: {
    id: string;
    fullName: string | null;
    email: string;
  };
  answerCount: number;
  voteSum: number;
}

export interface QuestionFilters {
  category?: string;
  userId?: string;
  search?: string;
}

/**
 * Create a new question
 * Migration note: Replace with POST /api/questions
 */
export async function createQuestion(
  data: QuestionData,
): Promise<{ question: Question | null; error: string | null }> {
  try {
    const { data: question, error } = await supabase
      .from("questions")
      .insert([
        {
          user_id: data.userId,
          title: data.title,
          content: data.content,
          category: data.category,
          post_type: data.postType || "question",
          image_video_url: data.imageVideoUrl || null,
          link_url: data.linkUrl || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return { question: null, error: error.message };
    }

    return { question, error: null };
  } catch (error: any) {
    return { question: null, error: error.message };
  }
}

/**
 * Get all questions with optional filtering
 * Migration note: Replace with GET /api/questions?category=...&user=...
 */
export async function getQuestions(
  filters?: QuestionFilters,
): Promise<QuestionWithAuthor[]> {
  try {
    let query = supabase
      .from("questions")
      .select(
        `
        *,
        profiles:user_id (
          id,
          full_name,
          email
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    if (filters?.userId) {
      query = query.eq("user_id", filters.userId);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    // Transform to QuestionWithAuthor format
    // In Django, this would be serialized on the backend
    return data.map((q: any) => ({
      ...q,
      author: {
        id: q.profiles?.id || "",
        fullName: q.profiles?.full_name || null,
        email: q.profiles?.email || "",
      },
      answerCount: 0, // Would be aggregated in Django
      voteSum: 0, // Would be aggregated in Django
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Get a single question by ID
 * Migration note: Replace with GET /api/questions/:id
 */
export async function getQuestionById(
  id: string,
): Promise<QuestionWithAuthor | null> {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        *,
        profiles:user_id (
          id,
          full_name,
          email
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      author: {
        id: data.profiles?.id || "",
        fullName: data.profiles?.full_name || null,
        email: data.profiles?.email || "",
      },
      answerCount: 0,
      voteSum: 0,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Update a question
 * Migration note: Replace with PUT /api/questions/:id
 */
export async function updateQuestion(
  id: string,
  data: Partial<QuestionData>,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;
    if (data.category) updateData.category = data.category;
    if (data.postType) updateData.post_type = data.postType;
    if (data.imageVideoUrl !== undefined)
      updateData.image_video_url = data.imageVideoUrl;
    if (data.linkUrl !== undefined) updateData.link_url = data.linkUrl;

    const { error } = await supabase
      .from("questions")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a question
 * Migration note: Replace with DELETE /api/questions/:id
 */
export async function deleteQuestion(
  id: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Increment question view count
 * Migration note: Replace with POST /api/questions/:id/view
 */
export async function incrementViewCount(id: string): Promise<void> {
  try {
    // In Django, this would be handled server-side
    await supabase.rpc("increment_view_count", { question_id: id });
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}
