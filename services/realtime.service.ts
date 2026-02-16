/**
 * Realtime Service
 *
 * This layer abstracts real-time functionality from Supabase Realtime.
 * When migrating to Django, replace with:
 * - Django Channels (WebSocket)
 * - Redis Pub/Sub
 * - Server-Sent Events (SSE)
 *
 * The interface remains the same, only implementation changes.
 */

import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE";

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

/**
 * Subscribe to question changes
 * Migration note: Replace with WebSocket connection to Django Channels
 * Example: ws://api.MIDEEYE.com/ws/questions/
 */
export function subscribeToQuestions(
  callback: (event: RealtimeEvent, data: any) => void,
): RealtimeSubscription {
  const channel: RealtimeChannel = supabase
    .channel("questions_channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "questions",
      },
      (payload) => {
        callback(payload.eventType as RealtimeEvent, payload.new);
      },
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Subscribe to answers for a specific question
 * Migration note: Replace with WebSocket to Django
 * Example: ws://api.MIDEEYE.com/ws/questions/:id/answers/
 */
export function subscribeToAnswers(
  questionId: string,
  callback: (event: RealtimeEvent, data: any) => void,
): RealtimeSubscription {
  const channel: RealtimeChannel = supabase
    .channel(`answers_${questionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "answers",
        filter: `question_id=eq.${questionId}`,
      },
      (payload) => {
        callback(payload.eventType as RealtimeEvent, payload.new);
      },
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Subscribe to vote changes
 * Migration note: Replace with WebSocket to Django
 */
export function subscribeToVotes(
  votableId: string,
  callback: (event: RealtimeEvent, data: any) => void,
): RealtimeSubscription {
  const channel: RealtimeChannel = supabase
    .channel(`votes_${votableId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "votes",
        filter: `votable_id=eq.${votableId}`,
      },
      (payload) => {
        callback(payload.eventType as RealtimeEvent, payload.new);
      },
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Subscribe to user presence (online status)
 * Migration note: Replace with Django Channels presence tracking
 */
export function subscribeToPresence(
  channelName: string,
  callback: (users: any[]) => void,
): RealtimeSubscription {
  const channel: RealtimeChannel = supabase.channel(channelName);

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat();
      callback(users);
    })
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
