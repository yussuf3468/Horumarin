/**
 * Notification Service
 *
 * Handles all notification operations with real database backend.
 * NO MOCK DATA - production ready implementation.
 */

import { supabase } from "@/lib/supabase/client";
import { getCurrentUser } from "./auth.service";

// Service response type
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: "like" | "comment" | "answer" | "follow" | "mention" | "new_post";
  entity_id: string;
  entity_type: "question" | "answer" | "comment" | "profile";
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
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

export type NotificationWithActor = Notification & {
  actor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

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
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
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
export function subscribeToNotifications(
  userId: string,
  callback: (notification: NotificationWithActor) => void
) {
  const channel = (supabase as any)
    .channel(`notifications:user_id=${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      async (payload: any) => {
        // Fetch actor details
        const { data: actor } = await (supabase as any)
          .from("profiles")
          .select("id, full_name, avatar_url")
          .eq("id", payload.new.actor_id)
          .single();
        
        callback({
          ...payload.new,
          actor: actor || { id: payload.new.actor_id, full_name: null, avatar_url: null },
        });
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

/**
 * New API functions (compatible with useNotifications hook)
 */

/**
 * Get notifications with cursor pagination
 */
export async function getNotifications(options?: {
  limit?: number;
  cursor?: string;
  unreadOnly?: boolean;
}): Promise<ServiceResponse<NotificationWithActor[]>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { limit = 50, cursor, unreadOnly = false } = options || {};

    let query = (supabase as any)
      .from("notifications")
      .select(
        `
        *,
        actor:profiles!actor_id (
          id,
          full_name,
          avatar_url
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<ServiceResponse<number>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, data: 0, error: "Not authenticated" };
    }

    const { count, error } = await (supabase as any)
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      return { success: false, data: 0, error: error.message };
    }

    return { success: true, data: count || 0 };
  } catch (error: any) {
    return { success: false, data: 0, error: error.message };
  }
}

/**
 * Mark all notifications as read (new API)
 */
export async function markAllNotificationsAsRead(): Promise<ServiceResponse<number>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error, count } = await (supabase as any)
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("is_read", false)
      .select("*", { count: "exact" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
