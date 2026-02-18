/**
 * MESSAGE/CHAT SERVICE
 * Production-grade 1-on-1 messaging for Mideeye
 *
 * Architecture:
 * - Event-driven real-time messaging
 * - Optimistic UI support
 * - Cursor-based pagination
 * - No business logic in UI
 * - Ready for Django migration
 */

import { supabase } from "@/lib/supabase/client";

// =====================================================
// TYPES
// =====================================================

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  read_by: string[];
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_message_preview: string | null;
  is_archived: boolean;
  participants?: ConversationParticipant[];
  other_participant?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    status?: string;
    last_seen_at?: string;
  };
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  is_muted: boolean;
}

export interface TypingIndicator {
  conversation_id: string;
  user_id: string;
  started_at: string;
}

export interface UserPresence {
  user_id: string;
  status: "online" | "away" | "offline";
  last_seen_at: string;
  updated_at: string;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function extractConversationIdFromRpcResult(data: any): string | null {
  if (!data) return null;

  if (typeof data === "string") return data;

  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      if (typeof first.get_or_create_conversation === "string") {
        return first.get_or_create_conversation;
      }
      if (typeof first.id === "string") return first.id;
    }
  }

  if (typeof data === "object") {
    if (typeof data.get_or_create_conversation === "string") {
      return data.get_or_create_conversation;
    }
    if (typeof data.id === "string") return data.id;
  }

  return null;
}

// =====================================================
// CONVERSATION MANAGEMENT
// =====================================================

/**
 * Get or create conversation between two users
 */
export async function getOrCreateConversation(
  otherUserId: string,
): Promise<ServiceResponse<Conversation>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await (supabase as any).rpc(
      "get_or_create_conversation",
      {
        p_user_id_1: user.id,
        p_user_id_2: otherUserId,
      },
    );

    if (error) throw error;

    const conversationId = extractConversationIdFromRpcResult(data);
    if (!conversationId) {
      throw new Error("Failed to resolve conversation ID");
    }

    // Fetch full conversation details
    const conversationResult = await getConversation(conversationId);
    if (conversationResult.success && conversationResult.data) {
      return {
        success: true,
        data: conversationResult.data,
      };
    }

    // Fallback 1: Try from conversation list
    const listResult = await getConversations();
    if (listResult.success && listResult.data) {
      const matched = listResult.data.find((c) => c.id === conversationId);
      if (matched) {
        return {
          success: true,
          data: matched,
        };
      }
    }

    // Fallback 2: Build minimal conversation object so UI can proceed
    const profileMap = await fetchProfilesForUserIds([otherUserId]);
    const otherProfile = profileMap[otherUserId] || {
      id: otherUserId,
      full_name: null,
      avatar_url: null,
    };
    const now = new Date().toISOString();

    return {
      success: true,
      data: {
        id: conversationId,
        created_at: now,
        updated_at: now,
        last_message_at: now,
        last_message_preview: null,
        is_archived: false,
        other_participant: otherProfile,
        unread_count: 0,
      },
    };
  } catch (error: any) {
    console.error("Get/create conversation error:", error);
    return {
      success: false,
      error: error.message || "Failed to get or create conversation",
    };
  }
}

/**
 * Fetch profile rows for an array of user IDs from the profiles table.
 * Used by getConversation / getConversations to avoid the broken
 * auto-join (conversation_participants.user_id → auth.users, not profiles).
 */
async function fetchProfilesForUserIds(
  userIds: string[],
): Promise<
  Record<
    string,
    { id: string; full_name: string | null; avatar_url: string | null }
  >
> {
  if (userIds.length === 0) return {};
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);
  const map: Record<string, any> = {};
  for (const p of (data as any[]) || []) map[p.id] = p;
  return map;
}

/**
 * Get conversation by ID with participants
 */
export async function getConversation(
  conversationId: string,
): Promise<ServiceResponse<Conversation>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // 1. Fetch the conversation row
    const { data: convData, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();

    if (convError) throw convError;
    if (!convData) throw new Error("Conversation not found");

    // 2. Fetch participants (no profile join — FK is to auth.users, not profiles)
    const { data: participantRows, error: pError } = await supabase
      .from("conversation_participants")
      .select("*")
      .eq("conversation_id", conversationId);

    if (pError) throw pError;

    // 3. Manually fetch profiles for all participant user IDs
    const userIds = (participantRows || []).map((p: any) => p.user_id);
    const profileMap = await fetchProfilesForUserIds(userIds);

    const participants = (participantRows || []).map((p: any) => ({
      ...p,
      user: profileMap[p.user_id] || {
        id: p.user_id,
        full_name: null,
        avatar_url: null,
      },
    }));

    // 4. Identify the other participant
    const otherParticipant = participants.find(
      (p: any) => p.user_id !== user.id,
    );

    // 5. Get presence (best-effort)
    let presence;
    if (otherParticipant) {
      const presenceResult = await getUserPresence(otherParticipant.user_id);
      presence = presenceResult.data;
    }

    // 6. Get unread count
    const unreadResult = await getUnreadMessageCount(conversationId);

    const conversation: Conversation = {
      ...(convData as any),
      participants,
      other_participant: otherParticipant
        ? {
            ...otherParticipant.user,
            status: presence?.status,
            last_seen_at: presence?.last_seen_at,
          }
        : undefined,
      unread_count: unreadResult.data || 0,
    };

    return { success: true, data: conversation };
  } catch (error: any) {
    console.error("Get conversation error:", error);
    return {
      success: false,
      error: error.message || "Failed to get conversation",
    };
  }
}

/**
 * Get all conversations for current user
 */
export async function getConversations(): Promise<
  ServiceResponse<Conversation[]>
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get conversation IDs for user
    const { data: participantData, error: participantError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (participantError) throw participantError;

    const conversationIds = (participantData as any).map(
      (p: any) => p.conversation_id,
    );

    if (conversationIds.length === 0) {
      return { success: true, data: [] };
    }

    // 1. Get conversation rows (no participant join — FK is to auth.users)
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .in("id", conversationIds)
      .order("last_message_at", { ascending: false });

    if (error) throw error;

    // 2. Fetch all participant rows for these conversations in one query
    const { data: allParticipantRows } = await supabase
      .from("conversation_participants")
      .select("*")
      .in("conversation_id", conversationIds);

    // 3. Collect all unique user IDs and fetch their profiles in one shot
    const allUserIds = [
      ...new Set(
        (allParticipantRows || []).map((p: any) => p.user_id as string),
      ),
    ];
    const profileMap = await fetchProfilesForUserIds(allUserIds);

    // 4. Process each conversation
    const conversations: Conversation[] = await Promise.all(
      (data || []).map(async (conv: any) => {
        const convParticipants = (allParticipantRows || [])
          .filter((p: any) => p.conversation_id === conv.id)
          .map((p: any) => ({
            ...p,
            user: profileMap[p.user_id] || {
              id: p.user_id,
              full_name: null,
              avatar_url: null,
            },
          }));

        const otherParticipant = convParticipants.find(
          (p: any) => p.user_id !== user.id,
        );

        let presence;
        if (otherParticipant) {
          const presenceResult = await getUserPresence(
            otherParticipant.user_id,
          );
          presence = presenceResult.data;
        }

        const unreadResult = await getUnreadMessageCount(conv.id);

        return {
          ...conv,
          participants: convParticipants,
          other_participant: otherParticipant
            ? {
                ...otherParticipant.user,
                status: presence?.status,
                last_seen_at: presence?.last_seen_at,
              }
            : undefined,
          unread_count: unreadResult.data || 0,
        };
      }),
    );

    return { success: true, data: conversations };
  } catch (error: any) {
    console.error("Get conversations error:", error);
    return {
      success: false,
      error: error.message || "Failed to get conversations",
    };
  }
}

// =====================================================
// MESSAGES
// =====================================================

/**
 * Get messages for conversation with pagination
 */
export async function getMessages(params: {
  conversationId: string;
  limit?: number;
  cursor?: string;
}): Promise<ServiceResponse<Message[]>> {
  try {
    const { conversationId, limit = 50, cursor } = params;

    let query = supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: (data || []).reverse() as Message[],
    };
  } catch (error: any) {
    console.error("Get messages error:", error);
    return {
      success: false,
      error: error.message || "Failed to get messages",
    };
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<ServiceResponse<Message>> {
  try {
    const { data, error } = await (supabase as any).rpc("send_message", {
      p_conversation_id: conversationId,
      p_content: content,
    });

    if (error) throw error;

    // Fetch the created message
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("id", data)
      .single();

    if (fetchError) throw fetchError;

    return {
      success: true,
      data: message as Message,
    };
  } catch (error: any) {
    console.error("Send message error:", error);
    return {
      success: false,
      error: error.message || "Failed to send message",
    };
  }
}

/**
 * Edit a message
 */
export async function editMessage(
  messageId: string,
  newContent: string,
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("edit_message", {
      p_message_id: messageId,
      p_new_content: newContent,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Edit message error:", error);
    return {
      success: false,
      error: error.message || "Failed to edit message",
    };
  }
}

/**
 * Delete a message (soft delete)
 */
export async function deleteMessage(
  messageId: string,
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("delete_message", {
      p_message_id: messageId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Delete message error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete message",
    };
  }
}

/**
 * Mark conversation as read
 */
export async function markConversationAsRead(
  conversationId: string,
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("mark_conversation_read", {
      p_conversation_id: conversationId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Mark conversation read error:", error);
    return {
      success: false,
      error: error.message || "Failed to mark conversation as read",
    };
  }
}

/**
 * Get unread message count for conversation
 */
export async function getUnreadMessageCount(
  conversationId: string,
): Promise<ServiceResponse<number>> {
  try {
    const { data, error } = await (supabase as any).rpc(
      "get_unread_message_count",
    );

    if (error) throw error;

    const counts = data || [];
    const conversation = counts.find(
      (c: any) => c.conversation_id === conversationId,
    );

    return {
      success: true,
      data: conversation?.unread_count || 0,
    };
  } catch (error: any) {
    console.error("Get unread count error:", error);
    return {
      success: false,
      data: 0,
      error: error.message,
    };
  }
}

// =====================================================
// TYPING INDICATORS
// =====================================================

/**
 * Set typing indicator
 */
export async function setTyping(
  conversationId: string,
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("set_typing", {
      p_conversation_id: conversationId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Set typing error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Clear typing indicator
 */
export async function clearTyping(
  conversationId: string,
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("clear_typing", {
      p_conversation_id: conversationId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Clear typing error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// =====================================================
// USER PRESENCE
// =====================================================

/**
 * Update user presence
 */
export async function updatePresence(
  status: "online" | "away" | "offline",
): Promise<ServiceResponse<void>> {
  try {
    const { error } = await (supabase as any).rpc("update_presence", {
      p_status: status,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Update presence error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get user presence
 */
export async function getUserPresence(
  userId: string,
): Promise<ServiceResponse<UserPresence>> {
  try {
    const { data, error } = await supabase
      .from("user_presence")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as UserPresence,
    };
  } catch (error: any) {
    // If no presence record, assume offline
    return {
      success: true,
      data: {
        user_id: userId,
        status: "offline",
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }
}

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

/**
 * Subscribe to new messages in a conversation
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void,
): () => void {
  const subscription = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      async (payload) => {
        // Fetch full message with sender
        const { data: message } = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:profiles!messages_sender_id_fkey(
              id,
              full_name,
              avatar_url
            )
          `,
          )
          .eq("id", payload.new.id)
          .single();

        if (message) {
          callback(message as Message);
        }
      },
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to typing indicators
 */
export function subscribeToTyping(
  conversationId: string,
  callback: (userId: string, isTyping: boolean) => void,
): () => void {
  const subscription = supabase
    .channel(`typing:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "typing_indicators",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          callback((payload.new as any).user_id, true);
        } else if (payload.eventType === "DELETE") {
          callback((payload.old as any).user_id, false);
        }
      },
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to presence changes
 */
export function subscribeToPresence(
  userId: string,
  callback: (presence: UserPresence) => void,
): () => void {
  const subscription = supabase
    .channel(`presence:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_presence",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as UserPresence);
        }
      },
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
