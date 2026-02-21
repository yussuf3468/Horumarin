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

/* ─────────────────────── Types ─────────────────────── */
type ChatUser = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

/* ─────────────────────── Helpers ─────────────────────── */
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
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}

/* ─────────────────────── Avatar ─────────────────────── */
const GRADIENTS: [string, string][] = [
  ["#7c3aed", "#6d28d9"],
  ["#2563eb", "#0891b2"],
  ["#059669", "#0d9488"],
  ["#e11d48", "#db2777"],
  ["#d97706", "#ea580c"],
  ["#4f46e5", "#2563eb"],
];

function getGradient(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function Avatar({ user, size = 40 }: { user: ChatUser; size?: number }) {
  const [from, to] = getGradient(user.id);
  return (
    <div
      className="relative flex-shrink-0 rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar_url}
          alt={user.full_name || "User"}
          style={{ width: size, height: size }}
          className="object-cover"
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            background: `linear-gradient(135deg, ${from}, ${to})`,
            fontSize: Math.round(size * 0.36),
          }}
          className="flex items-center justify-center font-bold text-white select-none"
        >
          {getInitials(user.full_name)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Typing Indicator ─────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-3 pb-2">
      <div
        className="w-6 h-6 rounded-full flex-shrink-0"
        style={{ background: "#334155" }}
      />
      <div
        className="px-4 py-3 flex items-center gap-1.5"
        style={{
          background: "#1e293b",
          borderRadius: "18px 18px 18px 4px",
        }}
      >
        {[0, 180, 360].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              background: "#64748b",
              animationDelay: `${delay}ms`,
              animationDuration: "1.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Skeletons ─────────────────────── */
function ConvListSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 animate-pulse"
        >
          <div
            className="rounded-full flex-shrink-0"
            style={{ width: 50, height: 50, background: "#1e293b" }}
          />
          <div className="flex-1 space-y-2 min-w-0">
            <div
              className="rounded-full"
              style={{ height: 13, width: "55%", background: "#1e293b" }}
            />
            <div
              className="rounded-full"
              style={{ height: 11, width: "75%", background: "#172033" }}
            />
          </div>
          <div
            className="rounded-full"
            style={{ height: 10, width: 32, background: "#1e293b" }}
          />
        </div>
      ))}
    </div>
  );
}

function MsgSkeleton() {
  const items = [
    { mine: false, w: 180 },
    { mine: true, w: 140 },
    { mine: false, w: 220 },
    { mine: true, w: 160 },
    { mine: false, w: 110 },
    { mine: true, w: 190 },
  ];
  return (
    <div className="space-y-3 p-4 animate-pulse">
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex ${item.mine ? "justify-end" : "justify-start"}`}
        >
          <div
            className="rounded-2xl"
            style={{
              width: item.w,
              height: 40,
              background: item.mine ? "#1e3a5f" : "#1e293b",
            }}
          />
        </div>
      ))}
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
  const [showNewChat, setShowNewChat] = useState(false);
  // Mobile nav: "list" shows conversations, "chat" shows messages
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMessageCount = useRef(0);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );
  const otherParticipant = selectedConversation?.other_participant;

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
      try {
        const [convResult, peopleResult] = await Promise.all([
          getConversations(),
          (supabase as any)
            .from("profiles")
            .select("id, full_name, avatar_url")
            .neq("id", user.id)
            .order("created_at", { ascending: false })
            .limit(50),
        ]);
        if (convResult.success && convResult.data) {
          setConversations(convResult.data);
        }
        setPeople((peopleResult.data || []) as ChatUser[]);
      } catch (e) {
        console.error("[Chat] load error:", e);
      } finally {
        setLoadingConversations(false);
      }
    };
    load();
  }, [user]);

  /* ── Messages + realtime ── */
  useEffect(() => {
    if (!selectedConversationId || !user) return;

    setLoadingMessages(true);
    setMessages([]);
    prevMessageCount.current = 0;
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const result = await getMessages({
          conversationId: selectedConversationId,
          limit: 100,
        });
        if (!cancelled) {
          setMessages(result.success && result.data ? result.data : []);
          await markConversationAsRead(selectedConversationId);
        }
      } catch (e) {
        console.error("[Chat] messages error:", e);
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
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
      cancelled = true;
      unsubMessages();
      unsubTyping();
      clearTyping(selectedConversationId);
      setTypingUserIds([]);
    };
  }, [selectedConversationId, user]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isInitialLoad = prevMessageCount.current === 0 && messages.length > 0;
    const isNewMessage =
      prevMessageCount.current > 0 &&
      messages.length > prevMessageCount.current;
    prevMessageCount.current = messages.length;

    if (isInitialLoad) {
      // Double rAF: first frame commits layout, second frame the scroll is
      // accurate. Required on mobile Safari where scrollHeight is stale
      // right after setState.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
              messagesContainerRef.current.scrollHeight;
          }
        });
      });
    } else if (isNewMessage || typingUserIds.length > 0) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages, typingUserIds]);

  /* ── Actions ── */
  const openConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    setMobileView("chat");
  }, []);

  const goBackToList = useCallback(() => {
    setMobileView("list");
  }, []);

  const startConversation = useCallback(
    async (targetUserId: string) => {
      const result = await getOrCreateConversation(targetUserId);
      if (!result.success || !result.data) return;
      setConversations((prev) => {
        if (prev.some((c) => c.id === result.data?.id)) return prev;
        return [result.data as Conversation, ...prev];
      });
      setShowNewChat(false);
      openConversation(result.data.id);
    },
    [openConversation],
  );

  const handleSendMessage = useCallback(async () => {
    if (!selectedConversationId || !messageInput.trim() || sending) return;
    setSending(true);
    const content = messageInput.trim();
    setMessageInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
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

  /* ─────────── Loading / auth states ─────────── */
  if (authLoading) {
    return (
      <div
        style={{
          backgroundColor: "#0a0f1a",
          position: "fixed",
          top: 44,
          left: 0,
          right: 0,
          bottom: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="md:bottom-0"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 animate-spin"
            style={{
              borderColor: "#1e293b",
              borderTopColor: "#3b82f6",
            }}
          />
          <p style={{ color: "#64748b" }} className="text-sm">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ════════════════════════════════════════════════
     RENDER — WhatsApp-style mobile-first layout
  ════════════════════════════════════════════════ */
  return (
    <div
      style={{
        backgroundColor: "#0a0f1a",
        position: "fixed",
        // Header is h-11 (2.75rem) + safe-area-inset-top
        top: "calc(2.75rem + env(safe-area-inset-top))" as any,
        left: 0,
        right: 0,
        // BottomNav is hidden on chat page — go full to bottom
        bottom: 0,
        display: "flex",
        overflow: "hidden",
      }}
      className="md:bottom-0"
    >
      {/* ══════════ CONVERSATION LIST PANEL ══════════ */}
      <div
        style={{
          backgroundColor: "#0d1525",
          borderRight: "1px solid #1a2744",
          height: "100%",
        }}
        className={`
          flex-col
          w-full lg:w-[360px] lg:flex-shrink-0
          ${mobileView === "list" ? "flex" : "hidden"} lg:flex
        `}
      >
        {/* List Header */}
        <div
          style={{
            backgroundColor: "#111c30",
            borderBottom: "1px solid #1a2744",
            paddingTop: "max(16px, env(safe-area-inset-top))",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingBottom: "14px",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="transition-transform active:scale-90"
                style={{
                  color: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>
              <h1 style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>
                Messages
              </h1>
            </div>
            <button
              onClick={() => setShowNewChat((v) => !v)}
              className="transition-all active:scale-90"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: showNewChat
                  ? "linear-gradient(135deg, #3b82f6, #7c3aed)"
                  : "#1e2d45",
                color: showNewChat ? "#fff" : "#94a3b8",
                transform: showNewChat ? "rotate(45deg)" : "none",
                transition: "all 0.2s",
              }}
            >
              <svg
                className="w-5 h-5"
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
        </div>

        {/* Search bar */}
        <div
          style={{
            backgroundColor: "#0d1525",
            padding: "10px 12px 8px",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#475569",
                pointerEvents: "none",
              }}
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
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: 38,
                paddingRight: 14,
                paddingTop: 9,
                paddingBottom: 9,
                borderRadius: 12,
                background: "#1a2744",
                color: "#e2e8f0",
                border: "none",
                outline: "none",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* New Chat Panel */}
        {showNewChat && (
          <div
            style={{
              margin: "0 12px 8px",
              borderRadius: 14,
              background: "#111c30",
              border: "1px solid #1e3a5f",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div style={{ padding: "12px 16px 8px" }}>
              <p
                style={{
                  color: "#3b82f6",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Start new chat
              </p>
            </div>
            <div style={{ maxHeight: 240, overflowY: "auto" }}>
              {people.length === 0 ? (
                <p
                  style={{
                    color: "#475569",
                    fontSize: 13,
                    padding: "12px 16px",
                  }}
                >
                  No users found
                </p>
              ) : (
                people.map((person, idx) => (
                  <button
                    key={person.id}
                    onClick={() => startConversation(person.id)}
                    className="w-full text-left transition-colors active:opacity-60"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 16px",
                      borderTop: idx > 0 ? "1px solid #1a2744" : "none",
                    }}
                  >
                    <Avatar user={person} size={38} />
                    <span
                      style={{
                        color: "#e2e8f0",
                        fontSize: 14,
                        fontWeight: 500,
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {person.full_name || "Unknown user"}
                    </span>
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#3b82f6" }}
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

        {/* Conversation list */}
        <div
          style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain" }}
        >
          {loadingConversations ? (
            <ConvListSkeleton />
          ) : filteredConversations.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 24px",
                gap: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: "#475569" }}
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
              <div>
                <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>
                  {searchQuery ? "No results" : "No conversations yet"}
                </p>
                <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>
                  {searchQuery
                    ? "Try a different name"
                    : "Tap + to start chatting"}
                </p>
              </div>
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
                  onClick={() => openConversation(conv.id)}
                  className="w-full text-left transition-colors active:opacity-60"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    padding: "13px 16px",
                    borderBottom: "1px solid #111c30",
                    background: isActive ? "#1a2f50" : "transparent",
                  }}
                >
                  <Avatar user={avatarUser} size={52} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          color: "#f1f5f9",
                          fontWeight: 600,
                          fontSize: 15,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {other?.full_name || "Unknown"}
                      </span>
                      <span
                        style={{
                          color: isActive ? "#60a5fa" : "#475569",
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: 13,
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conv.last_message_preview || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ══════════ MESSAGE PANE ══════════ */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: "#0a0f1a",
        }}
        className={`flex-col ${mobileView === "chat" ? "flex" : "hidden"} lg:flex`}
      >
        {!selectedConversation ? (
          /* Desktop empty state — only visible on large screens */
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center gap-5 select-none">
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1e3a5f, #1e1b4b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                className="w-11 h-11"
                style={{ color: "#3b82f6" }}
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
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "#e2e8f0", fontSize: 17, fontWeight: 600 }}>
                Select a conversation
              </h3>
              <p style={{ color: "#475569", fontSize: 13, marginTop: 6 }}>
                Choose from your messages or start a new one
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Chat Header ── */}
            <div
              style={{
                backgroundColor: "#111c30",
                borderBottom: "1px solid #1a2744",
                paddingTop: "max(12px, env(safe-area-inset-top))",
                paddingBottom: 12,
                paddingLeft: 12,
                paddingRight: 12,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Back button (mobile only) */}
              <button
                onClick={goBackToList}
                className="lg:hidden transition-transform active:scale-90"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#60a5fa",
                  flexShrink: 0,
                  background: "#1a2744",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </button>

              {/* Avatar */}
              {otherParticipant && (
                <Avatar
                  user={{
                    id: otherParticipant.id || selectedConversationId!,
                    full_name: otherParticipant.full_name ?? null,
                    avatar_url: otherParticipant.avatar_url ?? null,
                  }}
                  size={40}
                />
              )}

              {/* Name + status */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    color: "#f1f5f9",
                    fontWeight: 600,
                    fontSize: 15,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {otherParticipant?.full_name || "Chat"}
                </p>
                {typingUserIds.length > 0 ? (
                  <p
                    style={{ color: "#3b82f6", fontSize: 12, fontWeight: 500 }}
                  >
                    typing…
                  </p>
                ) : (
                  <p
                    style={{
                      color: "#22c55e",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#22c55e",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    online
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  className="transition-transform active:scale-90"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    background: "#1a2744",
                  }}
                >
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z"
                    />
                  </svg>
                </button>
                <button
                  className="transition-transform active:scale-90"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    background: "#1a2744",
                  }}
                >
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
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Messages area ── */}
            <div
              ref={messagesContainerRef}
              style={{
                flex: 1,
                minHeight: 0, // critical: lets flex-child shrink so overflow works
                overflowY: "auto",
                overflowX: "hidden",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch", // iOS momentum scroll
                backgroundColor: "#0a0f1a",
                backgroundImage:
                  "radial-gradient(circle at 12% 55%, rgba(59,130,246,0.04) 0%, transparent 55%), radial-gradient(circle at 88% 15%, rgba(124,58,237,0.04) 0%, transparent 55%)",
                paddingBottom: 8,
              }}
            >
              {loadingMessages ? (
                <MsgSkeleton />
              ) : messages.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: 16,
                    padding: "40px 24px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #064e3b, #134e4a)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: "#34d399" }}
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
                  <div>
                    <p
                      style={{
                        color: "#e2e8f0",
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      Say hi to{" "}
                      <span style={{ color: "#60a5fa" }}>
                        {otherParticipant?.full_name || "them"}
                      </span>
                      !
                    </p>
                    <p style={{ color: "#475569", fontSize: 13, marginTop: 6 }}>
                      Be the first to send a message
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    paddingTop: 8,
                    paddingBottom: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {messages.map((msg, index) => {
                    const isMine =
                      !!currentUserId && msg.sender_id === currentUserId;
                    const prevMsg = index > 0 ? messages[index - 1] : null;
                    const nextMsg =
                      index < messages.length - 1 ? messages[index + 1] : null;
                    const showDaySep =
                      !prevMsg ||
                      !isSameDay(prevMsg.created_at, msg.created_at);
                    const isFirstInGroup =
                      !prevMsg || prevMsg.sender_id !== msg.sender_id;
                    const isLastInGroup =
                      !nextMsg || nextMsg.sender_id !== msg.sender_id;

                    // Border radius: WhatsApp-style bubble tails
                    const r = 18;
                    const tailSize = 4;
                    const borderRadius =
                      isFirstInGroup && isLastInGroup
                        ? `${r}px`
                        : isFirstInGroup
                          ? isMine
                            ? `${r}px ${r}px ${tailSize}px ${r}px`
                            : `${r}px ${r}px ${r}px ${tailSize}px`
                          : isLastInGroup
                            ? isMine
                              ? `${r}px ${tailSize}px ${r}px ${r}px`
                              : `${tailSize}px ${r}px ${r}px ${r}px`
                            : isMine
                              ? `${r}px ${tailSize}px ${tailSize}px ${r}px`
                              : `${tailSize}px ${r}px ${r}px ${tailSize}px`;

                    return (
                      <div key={msg.id}>
                        {/* Day separator */}
                        {showDaySep && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "10px 16px 6px",
                              margin: "4px 0",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: 1,
                                background: "#1a2744",
                              }}
                            />
                            <span
                              style={{
                                color: "#94a3b8",
                                fontSize: 11,
                                fontWeight: 500,
                                padding: "3px 12px",
                                background: "#131c2e",
                                border: "1px solid #1a2744",
                                borderRadius: 20,
                              }}
                            >
                              {formatDaySeparator(msg.created_at)}
                            </span>
                            <div
                              style={{
                                flex: 1,
                                height: 1,
                                background: "#1a2744",
                              }}
                            />
                          </div>
                        )}

                        {/* Message row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 6,
                            padding: "0 12px",
                            justifyContent: isMine ? "flex-end" : "flex-start",
                            marginTop: isFirstInGroup ? 6 : 1,
                            marginBottom: isLastInGroup ? 4 : 1,
                          }}
                        >
                          {/* Avatar space for others */}
                          {!isMine && (
                            <div
                              style={{
                                width: 24,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "flex-end",
                              }}
                            >
                              {isLastInGroup && otherParticipant && (
                                <div
                                  style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${getGradient(otherParticipant.id || "")[0]}, ${getGradient(otherParticipant.id || "")[1]})`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: 9,
                                    fontWeight: 700,
                                    flexShrink: 0,
                                  }}
                                >
                                  {getInitials(otherParticipant.full_name)}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Bubble + timestamp */}
                          <div
                            style={{
                              maxWidth: "76%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: isMine ? "flex-end" : "flex-start",
                            }}
                          >
                            <div
                              style={{
                                background: isMine
                                  ? "linear-gradient(135deg, #1e40af, #5b21b6)"
                                  : "#1e2d45",
                                color: "#f1f5f9",
                                padding: "9px 14px",
                                borderRadius,
                                fontSize: 14,
                                lineHeight: 1.5,
                                wordBreak: "break-word",
                                boxShadow: isMine
                                  ? "0 2px 6px rgba(30, 64, 175, 0.4)"
                                  : "0 1px 3px rgba(0,0,0,0.4)",
                              }}
                            >
                              {msg.content}
                            </div>
                            {/* Timestamp under last message in group */}
                            {isLastInGroup && (
                              <span
                                style={{
                                  color: "#475569",
                                  fontSize: 10,
                                  marginTop: 3,
                                  paddingLeft: 2,
                                  paddingRight: 2,
                                }}
                              >
                                {formatMessageTime(msg.created_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {typingUserIds.length > 0 && <TypingIndicator />}
                  <div ref={messagesEndRef} style={{ height: 4 }} />
                </div>
              )}
            </div>

            {/* ── Input Bar ── */}
            <div
              style={{
                backgroundColor: "#111c30",
                borderTop: "1px solid #1a2744",
                padding: `10px 12px max(12px, env(safe-area-inset-bottom)) 12px`,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              {/* Attach */}
              <button
                className="transition-transform active:scale-90 flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  background: "#1a2744",
                  marginBottom: 0,
                }}
              >
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

              {/* Textarea */}
              <div style={{ flex: 1, position: "relative" }}>
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
                  placeholder="Message…"
                  style={{
                    width: "100%",
                    background: "#1a2744",
                    color: "#f1f5f9",
                    border: "none",
                    outline: "none",
                    borderRadius: 22,
                    padding: "10px 16px",
                    fontSize: 14,
                    lineHeight: 1.5,
                    resize: "none",
                    minHeight: 40,
                    maxHeight: 120,
                    overflowY: "auto",
                    caretColor: "#3b82f6",
                  }}
                />
              </div>

              {/* Send */}
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sending}
                className="transition-all active:scale-90 flex-shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    messageInput.trim() && !sending
                      ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                      : "#1a2744",
                  color: messageInput.trim() && !sending ? "#fff" : "#3d5270",
                  cursor:
                    messageInput.trim() && !sending ? "pointer" : "not-allowed",
                  boxShadow:
                    messageInput.trim() && !sending
                      ? "0 2px 10px rgba(37,99,235,0.5)"
                      : "none",
                  transition: "all 0.15s",
                  marginBottom: 0,
                }}
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
                    className="w-4 h-4"
                    style={{ transform: "translateX(1px)" }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405z" />
                  </svg>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
