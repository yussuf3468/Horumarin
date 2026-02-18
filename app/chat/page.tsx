"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  type Conversation,
  type Message,
  getConversations,
  getMessages,
  getOrCreateConversation,
  sendMessage,
  markConversationAsRead,
  subscribeToMessages,
  subscribeToTyping,
  setTyping,
  clearTyping,
} from "@/services/message.service";

/* ─────────────────────── tiny helpers ─────────────────────── */
type ChatUser = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatTime(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function formatDaySeparator(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* ─────────────────────── Avatar ─────────────────────── */
const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
];
function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function ChatAvatar({
  user,
  size = "md",
}: {
  user: ChatUser;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  const gradient = getGradient(user.id);
  return (
    <div className="relative flex-shrink-0">
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar_url}
          alt={user.full_name || "User"}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-gray-800`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-800 select-none`}
        >
          {getInitials(user.full_name)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Typing bubble ─────────────────────── */
function TypingBubble() {
  return (
    <div className="flex items-end gap-2 px-4 pb-1">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center flex-shrink-0" />
      <div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 inline-block animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "1.2s" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 inline-block animate-bounce"
          style={{ animationDelay: "200ms", animationDuration: "1.2s" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 inline-block animate-bounce"
          style={{ animationDelay: "400ms", animationDuration: "1.2s" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── Skeletons ─────────────────────── */
function ConversationSkeleton() {
  return (
    <div className="space-y-1 px-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-3 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-10" />
        </div>
      ))}
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {[
        { mine: false, w: "w-52" },
        { mine: true, w: "w-40" },
        { mine: false, w: "w-64" },
        { mine: true, w: "w-44" },
        { mine: false, w: "w-36" },
        { mine: true, w: "w-56" },
      ].map((item, i) => (
        <div
          key={i}
          className={`flex ${item.mine ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`${item.w} h-10 rounded-2xl ${item.mine ? "bg-blue-200 dark:bg-blue-900/40" : "bg-slate-200 dark:bg-slate-700"}`}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────── Empty states ─────────────────────── */
function NoConversationSelected() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 select-none">
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 flex items-center justify-center">
          <svg
            className="w-14 h-14 text-blue-400 dark:text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 dark:border-blue-700 animate-ping opacity-20" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Your messages</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
          Choose a conversation on the left, or tap + to start a new one.
        </p>
      </div>
    </div>
  );
}

function NoMessages({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 select-none">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </div>
      <div className="text-center space-y-1.5">
        <p className="font-semibold text-slate-900 dark:text-slate-50">Start a conversation</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Say hi to <span className="font-medium text-slate-900 dark:text-slate-50">{name}</span>!
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [people, setPeople] = useState<ChatUser[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPeoplePanel, setShowPeoplePanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) =>
      c.other_participant?.full_name?.toLowerCase().includes(q),
    );
  }, [conversations, searchQuery]);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  /* ── Load conversations + people ── */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoadingConversations(true);
      const [convResult, peopleResult] = await Promise.all([
        getConversations(),
        (supabase as any)
          .from("profiles")
          .select("id, full_name, avatar_url")
          .neq("id", user.id)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);
      if (convResult.success && convResult.data) {
        setConversations(convResult.data);
        if (convResult.data.length > 0)
          setSelectedConversationId(convResult.data[0].id);
      }
      setPeople((peopleResult.data || []) as ChatUser[]);
      setLoadingConversations(false);
    };

    load();
  }, [user]);

  /* ── Messages + realtime ── */
  useEffect(() => {
    if (!selectedConversationId || !user) return;

    setLoadingMessages(true);
    setMessages([]);

    const loadMessages = async () => {
      const result = await getMessages({
        conversationId: selectedConversationId,
        limit: 100,
      });
      if (result.success && result.data) setMessages(result.data);
      else setMessages([]);
      await markConversationAsRead(selectedConversationId);
      setLoadingMessages(false);
    };

    loadMessages();

    const unsubMessages = subscribeToMessages(
      selectedConversationId,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      },
    );

    const unsubTyping = subscribeToTyping(
      selectedConversationId,
      (uid, isTyping) => {
        if (uid === user.id) return;
        setTypingUserIds((prev) => {
          if (isTyping && !prev.includes(uid)) return [...prev, uid];
          if (!isTyping) return prev.filter((id) => id !== uid);
          return prev;
        });
      },
    );

    return () => {
      unsubMessages();
      unsubTyping();
      clearTyping(selectedConversationId);
      setTypingUserIds([]);
    };
  }, [selectedConversationId, user]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (messages.length > 0 || typingUserIds.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUserIds]);

  /* ── Actions ── */
  const startConversation = useCallback(async (targetUserId: string) => {
    const result = await getOrCreateConversation(targetUserId);
    if (!result.success || !result.data) return;
    setConversations((prev) => {
      if (prev.some((c) => c.id === result.data?.id)) return prev;
      return [result.data as Conversation, ...prev];
    });
    setSelectedConversationId(result.data.id);
    setShowPeoplePanel(false);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!selectedConversationId || !messageInput.trim() || sending) return;
    setSending(true);
    const content = messageInput.trim();
    setMessageInput("");
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    await clearTyping(selectedConversationId);

    const result = await sendMessage(selectedConversationId, content);
    if (result.success && result.data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === result.data?.id)) return prev;
        return [...prev, result.data as Message];
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversationId
            ? {
                ...c,
                last_message_preview: content,
                last_message_at: new Date().toISOString(),
              }
            : c,
        ),
      );
    }
    setSending(false);
    inputRef.current?.focus();
  }, [selectedConversationId, messageInput, sending]);

  const handleInputChange = useCallback(
    async (value: string) => {
      setMessageInput(value);
      if (!selectedConversationId) return;
      if (value.trim()) {
        await setTyping(selectedConversationId);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(async () => {
          await clearTyping(selectedConversationId!);
        }, 4000);
      } else {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        await clearTyping(selectedConversationId);
      }
    },
    [selectedConversationId],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  if (authLoading || (!user && !authLoading)) return null;

  const otherParticipant = selectedConversation?.other_participant;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 lg:py-6 h-screen flex flex-col">
        {/* ── Main grid ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-3 lg:gap-4 min-h-0">
          {/* ═══════ LEFT SIDEBAR ═══════ */}
          <aside className="flex flex-col min-h-0 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            {/* Sidebar header */}
            <div className="px-5 pt-5 pb-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Messages</h2>
                <button
                  onClick={() => setShowPeoplePanel(!showPeoplePanel)}
                  title="New chat"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                    showPeoplePanel
                      ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40 rotate-45"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-transparent focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* People panel (expandable) */}
            {showPeoplePanel && (
              <div className="flex-shrink-0 mx-3 mb-2 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border border-blue-100 dark:border-blue-800/40 overflow-hidden">
                <div className="px-4 pt-3 pb-2">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    People
                  </p>
                </div>
                <div className="max-h-44 overflow-y-auto overscroll-contain px-2 pb-2 space-y-0.5">
                  {people.length === 0 ? (
                    <p className="text-xs text-slate-600 dark:text-slate-400 px-3 py-3">
                      No users found
                    </p>
                  ) : (
                    people.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => startConversation(person.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/70 dark:hover:bg-white/5 transition-colors text-left group"
                      >
                        <ChatAvatar user={person} size="sm" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {person.full_name || "Unknown user"}
                        </span>
                        <svg
                          className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                          />
                        </svg>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-3 space-y-0.5">
              {loadingConversations ? (
                <ConversationSkeleton />
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-slate-500 dark:text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    No conversations yet
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Tap + to start a new chat
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = conv.other_participant;
                  const isActive = conv.id === selectedConversationId;
                  const avatarUser: ChatUser = {
                    id: other?.id || conv.id,
                    full_name: other?.full_name ?? null,
                    avatar_url: other?.avatar_url ?? null,
                  };
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left group ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-violet-600 shadow-md shadow-blue-200/60 dark:shadow-blue-900/40"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <ChatAvatar user={avatarUser} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-slate-900 dark:text-slate-50"}`}
                          >
                            {other?.full_name || "Unknown"}
                          </span>
                          <span
                            className={`text-xs flex-shrink-0 ${isActive ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}
                          >
                            {formatTime(conv.last_message_at)}
                          </span>
                        </div>
                        <p
                          className={`text-xs truncate mt-0.5 ${isActive ? "text-blue-100" : "text-slate-600 dark:text-slate-300"}`}
                        >
                          {conv.last_message_preview || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ═══════ RIGHT: MESSAGE PANE ═══════ */}
          <main className="flex flex-col min-h-0 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            {!selectedConversation ? (
              <NoConversationSelected />
            ) : (
              <>
                {/* ── Conversation header ── */}
                <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  {otherParticipant && (
                    <ChatAvatar
                      user={{
                        id: otherParticipant.id || selectedConversationId!,
                        full_name: otherParticipant.full_name ?? null,
                        avatar_url: otherParticipant.avatar_url ?? null,
                      }}
                      size="md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-50 leading-tight truncate">
                      {otherParticipant?.full_name || "Chat"}
                    </p>
                    {typingUserIds.length > 0 ? (
                      <p className="text-xs text-blue-500 font-medium animate-pulse">
                        Typing…
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Active now
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
                        />
                      </svg>
                    </button>
                    <button className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── Messages scroll area ── */}
                <div
                  className="flex-1 overflow-y-auto overscroll-contain py-4 space-y-1"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.03) 0%, transparent 50%)",
                  }}
                >
                  {loadingMessages ? (
                    <MessageSkeleton />
                  ) : messages.length === 0 ? (
                    <NoMessages name={otherParticipant?.full_name || "them"} />
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const isMine =
                          !!currentUserId && msg.sender_id === currentUserId;
                        const prevMsg = index > 0 ? messages[index - 1] : null;
                        const nextMsg =
                          index < messages.length - 1
                            ? messages[index + 1]
                            : null;
                        const showDaySep =
                          !prevMsg ||
                          !isSameDay(prevMsg.created_at, msg.created_at);
                        const isFirstInGroup =
                          !prevMsg || prevMsg.sender_id !== msg.sender_id;
                        const isLastInGroup =
                          !nextMsg || nextMsg.sender_id !== msg.sender_id;

                        return (
                          <div key={msg.id}>
                            {/* Day separator */}
                            {showDaySep && (
                              <div className="flex items-center gap-3 px-4 py-3">
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                  {formatDaySeparator(msg.created_at)}
                                </span>
                                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                              </div>
                            )}

                            {/* Message row */}
                            <div
                              className={`flex items-end gap-2 px-4 ${isMine ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-2" : "mb-0.5"}`}
                            >
                              {/* Avatar (others only, last in group) */}
                              {!isMine && (
                                <div className="w-7 flex-shrink-0">
                                  {isLastInGroup && otherParticipant && (
                                    <div
                                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${getGradient(otherParticipant.id || "")} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                                    >
                                      {getInitials(otherParticipant.full_name)}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Bubble */}
                              <div
                                className={`group relative max-w-[72%] flex flex-col ${isMine ? "items-end" : "items-start"}`}
                              >
                                <div
                                  className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                    isMine
                                      ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-blue-200/60 dark:shadow-blue-900/40"
                                      : "bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-50 border border-slate-100 dark:border-gray-700 shadow-slate-200/40"
                                  } ${
                                    isFirstInGroup && isLastInGroup
                                      ? "rounded-2xl"
                                      : isFirstInGroup
                                        ? isMine
                                          ? "rounded-2xl rounded-br-md"
                                          : "rounded-2xl rounded-bl-md"
                                        : isLastInGroup
                                          ? isMine
                                            ? "rounded-2xl rounded-tr-md"
                                            : "rounded-2xl rounded-tl-md"
                                          : isMine
                                            ? "rounded-r-md rounded-l-2xl"
                                            : "rounded-l-md rounded-r-2xl"
                                  }`}
                                >
                                  {msg.content}
                                </div>

                                {/* Timestamp (hover) */}
                                {isLastInGroup && (
                                  <span className="text-[10px] mt-1 px-1 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {formatMessageTime(msg.created_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {typingUserIds.length > 0 && <TypingBubble />}
                      <div ref={messagesEndRef} className="h-1" />
                    </>
                  )}
                  {messages.length === 0 && <div ref={messagesEndRef} />}
                </div>

                {/* ── Input bar ── */}
                <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-end gap-2">
                    {/* Attach icon */}
                    <button className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors mb-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                        />
                      </svg>
                    </button>

                    {/* Growing textarea */}
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        rows={1}
                        value={messageInput}
                        onChange={(e) => {
                          handleInputChange(e.target.value);
                          e.target.style.height = "auto";
                          e.target.style.height =
                            Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message…"
                        className="w-full resize-none rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm px-4 py-3 pr-12 border border-transparent focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all leading-relaxed overflow-hidden"
                        style={{ minHeight: "44px", maxHeight: "120px" }}
                      />
                      {/* Emoji */}
                      <button className="absolute right-3 bottom-3 text-foreground-muted hover:text-blue-500 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Send button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || sending}
                      className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 shadow-md mb-0.5 ${
                        messageInput.trim() && !sending
                          ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-blue-200 dark:shadow-blue-900/50 hover:scale-105 active:scale-95"
                          : "bg-slate-200 dark:bg-slate-700 text-foreground-muted cursor-not-allowed shadow-none"
                      }`}
                    >
                      {sending ? (
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Keyboard hint */}
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 pl-12">
                    Press{" "}
                    <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[9px] border border-slate-200 dark:border-slate-700">
                      Enter
                    </kbd>{" "}
                    to send &middot;{" "}
                    <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[9px] border border-slate-200 dark:border-slate-700">
                      Shift+Enter
                    </kbd>{" "}
                    for new line
                  </p>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
