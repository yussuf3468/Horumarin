"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import LightboxImage from "@/components/ui/LightboxImage";
import { categories } from "@/utils/constants";
import { formatDate, getHotScore, truncateText } from "@/utils/helpers";
import {
  castVote,
  getUserVotesForItems,
  removeVote,
} from "@/services/vote.service";
import {
  getQuestions,
  type QuestionWithAuthor,
} from "@/services/question.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const STORAGE_KEY = "horumarin-joined-topics";

type JoinedState = Record<string, boolean>;

type VoteMap = Record<string, number>;

type VoteCounts = Record<string, number>;

const postTypeLabels: Record<string, string> = {
  question: "Su'aal",
  discussion: "Dood",
  media: "Sawir",
  resource: "Khayraad",
  announcement: "Ogeysiis",
};

export default function TopicDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const topicId = Array.isArray(params.id) ? params.id[0] : params.id;
  const category = useMemo(
    () => categories.find((item) => item.id === topicId),
    [topicId],
  );

  const [joined, setJoined] = useState<JoinedState>({});
  const [posts, setPosts] = useState<QuestionWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteMap, setVoteMap] = useState<VoteMap>({});
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({});
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [topRange, setTopRange] = useState<"24h" | "7d" | "all">("24h");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setJoined(JSON.parse(stored) as JoinedState);
      } catch {
        setJoined({});
      }
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!topicId) return;
      const data = await getQuestions({ category: topicId });
      setPosts(data);
      setVoteCounts(
        data.reduce<Record<string, number>>((acc, item) => {
          acc[item.id] = item.voteSum || item.vote_count || 0;
          return acc;
        }, {}),
      );

      if (user) {
        const votes = await getUserVotesForItems(
          user.id,
          "question",
          data.map((item) => item.id),
        );
        setVoteMap(votes);
      } else {
        setVoteMap({});
      }
      setLoading(false);
    };

    fetchPosts();
  }, [topicId, user]);

  const sortedPosts = useMemo(() => {
    const items = [...posts];
    const withVotes = items.map((item) => ({
      ...item,
      _votes: (voteCounts[item.id] ?? item.voteSum) || item.vote_count || 0,
    }));

    if (sortBy === "top") {
      const now = Date.now();
      const rangeMs =
        topRange === "24h"
          ? 24 * 60 * 60 * 1000
          : topRange === "7d"
            ? 7 * 24 * 60 * 60 * 1000
            : null;

      const filtered = rangeMs
        ? withVotes.filter(
            (item) => now - new Date(item.created_at).getTime() <= rangeMs,
          )
        : withVotes;

      return filtered.sort((a, b) => b._votes - a._votes);
    }

    if (sortBy === "new") {
      return withVotes.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return withVotes.sort(
      (a, b) =>
        getHotScore(b._votes, b.created_at) -
        getHotScore(a._votes, a.created_at),
    );
  }, [posts, sortBy, topRange, voteCounts]);

  const toggleJoin = () => {
    if (!category) return;
    setJoined((prev) => {
      const next = { ...prev, [category.id]: !prev[category.id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleVote = async (postId: string, value: number) => {
    if (!user) {
      toast.info("Fadlan gal si aad u door bixiso.");
      return;
    }

    const currentVote = voteMap[postId] || 0;
    const nextVote = currentVote === value ? 0 : value;
    const currentCount = voteCounts[postId] || 0;
    const nextCount = currentCount - currentVote + nextVote;

    setVoteMap((prev) => ({ ...prev, [postId]: nextVote }));
    setVoteCounts((prev) => ({ ...prev, [postId]: nextCount }));

    const revert = () => {
      setVoteMap((prev) => ({ ...prev, [postId]: currentVote }));
      setVoteCounts((prev) => ({ ...prev, [postId]: currentCount }));
    };

    if (nextVote === 0) {
      const { error } = await removeVote(user.id, postId, "question");
      if (error) {
        toast.error("Khalad ayaa dhacay.");
        revert();
      }
      return;
    }

    if (nextVote === 1) {
      toast.success("Waxaad jeclaatay qoraalkan!");
    }

    const { error } = await castVote({
      userId: user.id,
      votableId: postId,
      votableType: "question",
      value: nextVote,
    });

    if (error) {
      toast.error("Khalad ayaa dhacay.");
      revert();
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="p-10">
            <h2 className="text-2xl font-bold mb-3">Bulsho lama helin</h2>
            <Link href="/topics" className="text-foreground-muted">
              Ku laabo bulshada
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const isJoined = joined[category.id];

  return (
    <div className="min-h-screen bg-background">
      <div className={`h-48 bg-gradient-to-r ${category.gradient}`}>
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="text-primary-foreground">
            <div className="text-4xl mb-2">{category.icon}</div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <p className="text-sm opacity-80 uppercase tracking-wide">
              {category.nameEn}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-2">{category.banner}</h2>
              <p className="text-foreground-muted">{category.description}</p>
            </Card>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={sortBy === "hot" ? "primary" : "outline"}
                onClick={() => setSortBy("hot")}
              >
                Hot
              </Button>
              <Button
                size="sm"
                variant={sortBy === "new" ? "primary" : "outline"}
                onClick={() => setSortBy("new")}
              >
                New
              </Button>
              <Button
                size="sm"
                variant={sortBy === "top" ? "primary" : "outline"}
                onClick={() => setSortBy("top")}
              >
                Top
              </Button>

              {sortBy === "top" && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={topRange === "24h" ? "primary" : "outline"}
                    onClick={() => setTopRange("24h")}
                  >
                    24h
                  </Button>
                  <Button
                    size="sm"
                    variant={topRange === "7d" ? "primary" : "outline"}
                    onClick={() => setTopRange("7d")}
                  >
                    7d
                  </Button>
                  <Button
                    size="sm"
                    variant={topRange === "all" ? "primary" : "outline"}
                    onClick={() => setTopRange("all")}
                  >
                    All
                  </Button>
                </div>
              )}
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {sortedPosts.length > 0 ? (
                    sortedPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card hover className="overflow-hidden">
                          <div className="p-6">
                            <div className="flex items-center gap-2 text-xs text-foreground-subtle mb-3">
                              <span className="px-2 py-1 rounded-full bg-surface-muted border border-border text-foreground-muted">
                                {postTypeLabels[post.post_type || "question"] ||
                                  "Qoraal"}
                              </span>
                              <span>•</span>
                              <span>{post.author?.fullName || "Xubin"}</span>
                              <span>•</span>
                              <span>{formatDate(post.created_at)}</span>
                            </div>

                            <Link href={`/questions/${post.id}`}>
                              <h3 className="font-bold text-xl mb-3 hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                            </Link>

                            <p className="text-foreground-muted mb-4 line-clamp-3">
                              {truncateText(post.content, 240)}
                            </p>

                            {post.image_video_url && (
                              <div className="mb-4">
                                <LightboxImage
                                  src={post.image_video_url}
                                  alt={post.title}
                                  className="border border-border"
                                  aspectRatio="16 / 9"
                                />
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-subtle mt-4 pt-4 border-t border-border">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleVote(post.id, 1)}
                                className={`flex items-center gap-1.5 transition-all ${
                                  voteMap[post.id] === 1
                                    ? "text-danger"
                                    : "text-foreground-subtle hover:text-danger"
                                }`}
                                aria-pressed={voteMap[post.id] === 1}
                                title={user ? "Like" : "Login to like"}
                              >
                                {voteMap[post.id] === 1 ? (
                                  <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                )}
                                <span className="font-medium">
                                  {(voteCounts[post.id] ?? post.voteSum) ||
                                    post.vote_count ||
                                    0}
                                </span>
                              </motion.button>
                              <Link
                                href={`/questions/${post.id}`}
                                className="flex items-center gap-1.5 text-foreground-subtle hover:text-primary transition-colors"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {post.comment_count || post.answerCount || 0}
                                </span>
                              </Link>
                              <span className="flex items-center gap-1.5">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                <span>{post.view_count}</span>
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <p className="text-foreground-muted">
                        Qoraalo wali lama helin.
                      </p>
                    </Card>
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Bulshada
              </h3>
              <div className="space-y-3 text-sm text-foreground-subtle">
                <div className="flex items-center justify-between">
                  <span>Xubnood</span>
                  <span>{category.members.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Moderator</span>
                  <span>{category.moderator}</span>
                </div>
              </div>
              <Button
                size="sm"
                className="mt-6 w-full"
                variant={isJoined ? "outline" : "primary"}
                onClick={toggleJoin}
              >
                {isJoined ? "Ka bax" : "Ku biir"}
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Xeerarka
              </h3>
              <ul className="space-y-2 text-sm text-foreground-subtle">
                <li>• Ku wadaag xog sax ah</li>
                <li>• Ixtiraam dhammaan xubnaha</li>
                <li>• Ku dar xigashooyin marka loo baahdo</li>
                <li>• Ka fogow spam</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Qaybo Kale
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((item) => item.id !== category.id)
                  .slice(0, 5)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/topics/${item.id}`}
                      className="px-3 py-1 rounded-full text-xs border border-border bg-surface-muted text-foreground-muted hover:text-foreground hover:border-border-strong transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
