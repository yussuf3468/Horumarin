"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "@/services/follow.service";

/* ─────────────────────── Types ─────────────────────── */
type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  isFollowing: boolean;
};

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
function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ user, size = 48 }: { user: UserProfile; size?: number }) {
  const [from, to] = getGradient(user.id);
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar_url}
          alt={user.full_name || ""}
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

/* ─────────────────────── Skeleton ─────────────────────── */
function UserCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl p-4 flex items-center gap-3"
      style={{ background: "#111827", border: "1px solid #1e293b" }}
    >
      <div
        className="rounded-full flex-shrink-0"
        style={{ width: 52, height: 52, background: "#1e293b" }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="rounded-full"
          style={{ height: 14, width: "50%", background: "#1e293b" }}
        />
        <div
          className="rounded-full"
          style={{ height: 12, width: "70%", background: "#172033" }}
        />
        <div className="flex gap-4">
          <div
            className="rounded-full"
            style={{ height: 11, width: 60, background: "#172033" }}
          />
          <div
            className="rounded-full"
            style={{ height: 11, width: 60, background: "#172033" }}
          />
        </div>
      </div>
      <div
        className="rounded-2xl"
        style={{ width: 80, height: 34, background: "#1e293b" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "following" | "followers">(
    "all",
  );
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followerIds, setFollowerIds] = useState<Set<string>>(new Set());
  const [loadingFollow, setLoadingFollow] = useState<Set<string>>(new Set());

  /* ── Load all users ── */
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all profiles except current user
      const { data: profiles, error: profilesError } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, avatar_url, bio")
        .neq("id", user?.id ?? "00000000-0000-0000-0000-000000000000")
        .order("created_at", { ascending: false })
        .limit(100);

      if (profilesError) throw profilesError;
      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        return;
      }

      const profileIds = profiles.map((p: any) => p.id as string);

      // Fetch user_stats in bulk (single query)
      const { data: statsRows } = await (supabase as any)
        .from("user_stats")
        .select("user_id, followers_count, following_count, posts_count")
        .in("user_id", profileIds);

      const statsMap: Record<string, any> = {};
      for (const s of statsRows || []) statsMap[s.user_id] = s;

      // Build enriched list — no per-user queries needed
      const enriched: UserProfile[] = profiles.map((p: any) => {
        const stats = statsMap[p.id] || {};
        return {
          id: p.id,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          bio: p.bio,
          followers_count: stats.followers_count ?? 0,
          following_count: stats.following_count ?? 0,
          posts_count: stats.posts_count ?? 0,
          isFollowing: false,
        };
      });

      // Fetch current user's following/followers IDs
      if (user) {
        const [followingResult, followersResult] = await Promise.all([
          getFollowing({ userId: user.id }),
          getFollowers({ userId: user.id }),
        ]);

        const followingSet = new Set(
          (followingResult.data || []).map((f: any) => f.id),
        );
        const followerSet = new Set(
          (followersResult.data || []).map((f: any) => f.id),
        );

        setFollowingIds(followingSet);
        setFollowerIds(followerSet);

        // Mark who we're following
        const marked = enriched.map((u) => ({
          ...u,
          isFollowing: followingSet.has(u.id),
        }));
        setUsers(marked);
        setFilteredUsers(marked);
      } else {
        setUsers(enriched);
        setFilteredUsers(enriched);
      }
    } catch (e) {
      console.error("[Users] load error:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadUsers();
  }, [authLoading, loadUsers]);

  /* ── Filter by search + tab ── */
  useEffect(() => {
    let result = users;

    if (activeTab === "following") {
      result = result.filter((u) => followingIds.has(u.id));
    } else if (activeTab === "followers") {
      result = result.filter((u) => followerIds.has(u.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.bio?.toLowerCase().includes(q),
      );
    }

    setFilteredUsers(result);
  }, [users, searchQuery, activeTab, followingIds, followerIds]);

  /* ── Toggle follow ── */
  const toggleFollow = useCallback(
    async (targetId: string, currentlyFollowing: boolean) => {
      if (!user || loadingFollow.has(targetId)) return;

      setLoadingFollow((prev) => new Set(prev).add(targetId));

      // Optimistic update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetId
            ? {
                ...u,
                isFollowing: !currentlyFollowing,
                followers_count: currentlyFollowing
                  ? u.followers_count - 1
                  : u.followers_count + 1,
              }
            : u,
        ),
      );

      if (currentlyFollowing) {
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(targetId);
          return next;
        });
      } else {
        setFollowingIds((prev) => new Set(prev).add(targetId));
      }

      // Server update
      const result = currentlyFollowing
        ? await unfollowUser(targetId)
        : await followUser(targetId);

      if (!result.success) {
        // Rollback
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetId
              ? {
                  ...u,
                  isFollowing: currentlyFollowing,
                  followers_count: currentlyFollowing
                    ? u.followers_count + 1
                    : u.followers_count - 1,
                }
              : u,
          ),
        );
        if (currentlyFollowing) {
          setFollowingIds((prev) => new Set(prev).add(targetId));
        } else {
          setFollowingIds((prev) => {
            const next = new Set(prev);
            next.delete(targetId);
            return next;
          });
        }
      }

      setLoadingFollow((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    },
    [user, loadingFollow],
  );

  const tabCounts = {
    all: users.length,
    following: users.filter((u) => followingIds.has(u.id)).length,
    followers: users.filter((u) => followerIds.has(u.id)).length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1a" }}>
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24">
        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold" style={{ color: "#f1f5f9" }}>
            People
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            Discover and connect with other members
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            style={{
              position: "absolute",
              left: 14,
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
            placeholder="Search by name or bio…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: 42,
              paddingRight: 16,
              paddingTop: 11,
              paddingBottom: 11,
              borderRadius: 14,
              background: "#111827",
              color: "#e2e8f0",
              border: "1px solid #1e293b",
              outline: "none",
              fontSize: 14,
            }}
          />
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 mb-5 p-1 rounded-xl"
          style={{ background: "#111827", border: "1px solid #1e293b" }}
        >
          {(["all", "following", "followers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
              style={{
                background:
                  activeTab === tab
                    ? "linear-gradient(135deg, #1e40af, #5b21b6)"
                    : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
                textTransform: "capitalize",
              }}
            >
              {tab}
              <span
                className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === tab ? "rgba(255,255,255,0.2)" : "#1e293b",
                  color: activeTab === tab ? "#c7d2fe" : "#475569",
                }}
              >
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* User cards */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))
          ) : filteredUsers.length === 0 ? (
            <div
              className="rounded-2xl p-10 flex flex-col items-center gap-3 text-center"
              style={{ background: "#111827", border: "1px solid #1e293b" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "#1e293b" }}
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold" style={{ color: "#e2e8f0" }}>
                  {searchQuery
                    ? "No users found"
                    : activeTab === "following"
                      ? "Not following anyone yet"
                      : activeTab === "followers"
                        ? "No followers yet"
                        : "No users found"}
                </p>
                <p className="text-sm mt-1" style={{ color: "#475569" }}>
                  {searchQuery
                    ? "Try a different search term"
                    : activeTab === "all"
                      ? "Be the first to join!"
                      : "Explore the All tab to find people"}
                </p>
              </div>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="rounded-2xl p-4 transition-colors"
                style={{ background: "#111827", border: "1px solid #1e293b" }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar — clickable to profile */}
                  <Link href={`/profile/${u.id}`}>
                    <UserAvatar user={u} size={52} />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${u.id}`} className="hover:underline">
                      <p
                        className="font-semibold text-sm leading-tight"
                        style={{ color: "#f1f5f9" }}
                      >
                        {u.full_name || "Unknown user"}
                      </p>
                    </Link>
                    {u.bio && (
                      <p
                        className="text-xs mt-1.5 leading-relaxed"
                        style={
                          {
                            color: "#94a3b8",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          } as React.CSSProperties
                        }
                      >
                        {u.bio}
                      </p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-2">
                      <span style={{ color: "#64748b", fontSize: 12 }}>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                          {u.followers_count}
                        </span>{" "}
                        followers
                      </span>
                      <span style={{ color: "#64748b", fontSize: 12 }}>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                          {u.following_count}
                        </span>{" "}
                        following
                      </span>
                      {u.posts_count > 0 && (
                        <span style={{ color: "#64748b", fontSize: 12 }}>
                          <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                            {u.posts_count}
                          </span>{" "}
                          posts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Follow / Unfollow button */}
                  {user && (
                    <button
                      onClick={() => toggleFollow(u.id, u.isFollowing)}
                      disabled={loadingFollow.has(u.id)}
                      className="flex-shrink-0 transition-all active:scale-95 font-semibold text-sm"
                      style={{
                        padding: "8px 16px",
                        borderRadius: 12,
                        background: u.isFollowing
                          ? "transparent"
                          : "linear-gradient(135deg, #2563eb, #7c3aed)",
                        color: u.isFollowing ? "#94a3b8" : "#fff",
                        border: u.isFollowing ? "1px solid #334155" : "none",
                        boxShadow: u.isFollowing
                          ? "none"
                          : "0 2px 8px rgba(37,99,235,0.35)",
                        cursor: loadingFollow.has(u.id) ? "wait" : "pointer",
                        opacity: loadingFollow.has(u.id) ? 0.7 : 1,
                        minWidth: 82,
                      }}
                    >
                      {loadingFollow.has(u.id) ? (
                        <svg
                          className="w-4 h-4 animate-spin mx-auto"
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
                      ) : u.isFollowing ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  )}

                  {/* Message button if following each other */}
                  {user && u.isFollowing && (
                    <button
                      onClick={() => router.push("/chat")}
                      className="flex-shrink-0 transition-all active:scale-95"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#1e293b",
                        color: "#60a5fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #334155",
                      }}
                      title="Send message"
                    >
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
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Mutual follow badge */}
                {followerIds.has(u.id) && followingIds.has(u.id) && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "#0f2d1f",
                        color: "#34d399",
                        border: "1px solid #166534",
                      }}
                    >
                      ✓ Mutual
                    </span>
                  </div>
                )}
                {followerIds.has(u.id) && !followingIds.has(u.id) && (
                  <div className="mt-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "#172033",
                        color: "#60a5fa",
                        border: "1px solid #1e3a5f",
                      }}
                    >
                      Follows you
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
