/**
 * Answer Service
 *
 * This layer abstracts all answer operations from Supabase.
 * When migrating to Django REST API, replace with:
 * - GET /api/questions/:questionId/answers
 * - POST /api/questions/:questionId/answers
 * - PUT /api/answers/:id
 * - DELETE /api/answers/:id
 */

import { supabase } from "@/lib/supabase/client";
import type { Answer } from "@/types";

export interface AnswerData {
  questionId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}

export interface AnswerWithAuthor extends Answer {
  author: {
    id: string;
    fullName: string | null;
    email: string;
  };
  voteSum: number;
}

/**
 * Create a new answer
 * Migration note: Replace with POST /api/questions/:questionId/answers
 */
export async function createAnswer(
  data: AnswerData,
): Promise<{ answer: Answer | null; error: string | null }> {
  try {
    const { data: answer, error } = await supabase
      .from("answers")
      .insert([
        {
          question_id: data.questionId,
          parent_id: data.parentId ?? null,
          user_id: data.userId,
          content: data.content,
        },
      ])
      .select()
      .single();

    if (error) {
      return { answer: null, error: error.message };
    }

    return { answer, error: null };
  } catch (error: any) {
    return { answer: null, error: error.message };
  }
}

/**
 * Get all answers for a question
 * Migration note: Replace with GET /api/questions/:questionId/answers
 */
export async function getAnswersByQuestionId(
  questionId: string,
): Promise<AnswerWithAuthor[]> {
  try {
    const { data, error } = await supabase
      .from("answers")
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
      .eq("question_id", questionId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    // Transform to AnswerWithAuthor format
    // In Django, this serialization happens server-side
    return data.map((a: any) => ({
      ...a,
      author: {
        id: a.profiles?.id || "",
        fullName: a.profiles?.full_name || null,
        email: a.profiles?.email || "",
      },
      voteSum: 0, // Would be aggregated in Django
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Get all answers by a user
 * Migration note: Replace with GET /api/users/:id/answers
 */
export async function getAnswersByUserId(
  userId: string,
): Promise<AnswerWithAuthor[]> {
  try {
    const { data, error } = await supabase
      .from("answers")
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((a: any) => ({
      ...a,
      author: {
        id: a.profiles?.id || "",
        fullName: a.profiles?.full_name || null,
        email: a.profiles?.email || "",
      },
      voteSum: 0,
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Update an answer
 * Migration note: Replace with PUT /api/answers/:id
 */
export async function updateAnswer(
  id: string,
  content: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("answers")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
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
 * Delete an answer
 * Migration note: Replace with DELETE /api/answers/:id
 */
export async function deleteAnswer(
  id: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from("answers").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Mark an answer as accepted
 * Migration note: Replace with POST /api/answers/:id/accept
 */
export async function acceptAnswer(
  answerId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("answers")
      .update({ is_accepted: true })
      .eq("id", answerId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
