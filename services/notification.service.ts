/**
 * Notification Service
 *
 * Handles all notification operations with real database backend.
 * NO MOCK DATA - production ready implementation.
 */

import { supabase } from "@/lib/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: "like" | "comment" | "answer" | "follow" | "mention" | "new_post";
  entity_id: string;
  entity_type: "question" | "answer" | "comment" | "profile";
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  actor?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  entity?: {
    id: string;
    title?: string;
  };
}

/**
 * Get all notifications for a user
 * Sorted by created_at DESC (newest first)
 */
export async function getUserNotifications(
  userId: string,
): Promise<{ notifications: Notification[]; error: string | null }> {
  try {
    const { data, error } = await (supabase as any)
      .from("notifications")
      .select(
        `
        *,
        actor:profiles!actor_id (
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return { notifications: [], error: error.message };
    }

    return { notifications: data || [], error: null };
  } catch (error: any) {
    return { notifications: [], error: error.message };
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(
  userId: string,
): Promise<{ count: number; error: string | null }> {
  try {
    const { count, error } = await (supabase as any)
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      return { count: 0, error: error.message };
    }

    return { count: count || 0, error: null };
  } catch (error: any) {
    return { count: 0, error: error.message };
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  userId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await (supabase as any)
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to real-time notification changes
 */
export function subscribeToNotifications(userId: string, callback: () => void) {
  const channel = (supabase as any)
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe();

  return channel;
}
