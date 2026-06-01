/**
 * Questions Feed Page
 *
 * Uses service layer for all data operations.
 * No direct Supabase calls - ready for Django migration.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { FeedPostSkeleton } from "@/components/ui/Skeleton";
import PostCard from "@/components/ui/PostCard";
import { categories } from "@/utils/constants";
import { formatDate, getHotScore } from "@/utils/helpers";
import {
  getQuestions,
  deleteQuestion,
  type QuestionWithAuthor,
} from "@/services/question.service";
import {
  castVote,
  getUserVotesForItems,
  removeVote,
} from "@/services/vote.service";
import { subscribeToQuestions } from "@/services/realtime.service";

export default function QuestionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [questions, setQuestions] = useState<QuestionWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [voteMap, setVoteMap] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [topRange, setTopRange] = useState<"24h" | "7d" | "all">("24h");

  const categoryStats = categories
    .map((category) => ({
      ...category,
      count: questions.filter((q) => q.category === category.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  const trendingTopics = categoryStats.some((c) => c.count > 0)
    ? categoryStats.filter((c) => c.count > 0).slice(0, 4)
    : categoryStats.slice(0, 4); // Changed from categories to categoryStats

  const activeUsers = Array.from(
    new Map(
      questions.map((question) => [
        question.author?.id || question.user_id,
        {
          id: question.author?.id || question.user_id,
          name: question.author?.fullName || "Xubin",
        },
      ]),
    ).values(),
  ).slice(0, 4);

  const sortedQuestions = useMemo(() => {
    const items = [...questions];
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
  }, [questions, sortBy, topRange, voteCounts]);

  useEffect(() => {
    fetchQuestions();

    // Subscribe to real-time changes
    // When migrating to Django, this will use WebSocket
    const subscription = subscribeToQuestions(() => {
      fetchQuestions();
    });

    return () => subscription.unsubscribe();
  }, [selectedCategory]);

  const fetchQuestions = async () => {
    // Using question service - when migrating to Django, only service layer changes
    const filters =
      selectedCategory !== "all" ? { category: selectedCategory } : undefined;
    const data = await getQuestions(filters);
    setQuestions(data);
    setVoteCounts(
      data.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.voteSum || item.vote_count || 0;
        return acc;
      }, {}),
    );
    setLoading(false);

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
  };

  const handleVote = async (questionId: string, value: number) => {
    if (!user) {
      toast.info("Fadlan gal si aad u door bixiso.");
      return;
    }

    const currentVote = voteMap[questionId] || 0;
    const nextVote = currentVote === value ? 0 : value;
    const currentCount = voteCounts[questionId] || 0;
    const nextCount = currentCount - currentVote + nextVote;

    setVoteMap((prev) => ({ ...prev, [questionId]: nextVote }));
    setVoteCounts((prev) => ({ ...prev, [questionId]: nextCount }));

    const revert = () => {
      setVoteMap((prev) => ({ ...prev, [questionId]: currentVote }));
      setVoteCounts((prev) => ({ ...prev, [questionId]: currentCount }));
    };

    if (nextVote === 0) {
      const { error } = await removeVote(user.id, questionId, "question");
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
      votableId: questionId,
      votableType: "question",
      value: nextVote,
    });

    if (error) {
      toast.error("Khalad ayaa dhacay.");
      revert();
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-1.5">
                Knowledge Feed
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading leading-tight">
                Questions
              </h1>
            </div>
            {user && (
              <Link href="/ask" className="hidden sm:block">
                <Button size="md" variant="primary">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Ask a Question
                </Button>
              </Link>
            )}
          </div>

          <div className="sticky top-14 z-30 -mx-3 px-3 sm:mx-0 sm:px-0 py-2.5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-y border-border/40 sm:border-y-0">
            {/* Category Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
              {[{ id: "all", name: "All", icon: "" }, ...categories].map(
                (cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 snap-start inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-primary/15 text-primary-400 border border-primary/30"
                        : "text-foreground-muted hover:text-foreground hover:bg-surface-muted border border-transparent"
                    }`}
                  >
                    {cat.icon && <span>{cat.icon}</span>}
                    {cat.name}
                  </button>
                ),
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1 mt-3">
              <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-xl border border-border/60">
                {(["hot", "new", "top"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                      sortBy === s
                        ? "bg-primary/15 text-primary-400"
                        : "text-foreground-subtle hover:text-foreground"
                    }`}
                  >
                    {s === "hot" ? "🔥 Hot" : s === "new" ? "✨ New" : "🏆 Top"}
                  </button>
                ))}
              </div>

              {sortBy === "top" && (
                <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-xl border border-border/60 ml-2">
                  {(["24h", "7d", "all"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTopRange(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        topRange === r
                          ? "bg-primary/15 text-primary-400"
                          : "text-foreground-subtle hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden mt-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {trendingTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="shrink-0 px-3 py-2 rounded-full border border-border bg-surface-muted text-xs text-foreground-muted"
                >
                  {topic.icon} {topic.name} ({topic.count ?? 0})
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 sm:gap-6">
          {/* Main Feed */}
          <div>
            {loading ? (
              <div className="space-y-4">
                <FeedPostSkeleton />
                <FeedPostSkeleton />
                <FeedPostSkeleton />
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-3 sm:space-y-4">
                  {sortedQuestions.length > 0 ? (
                    sortedQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <PostCard
                          id={question.id}
                          author={{
                            id: question.author?.id || question.user_id,
                            fullName: question.author?.fullName || "Xubin",
                            avatar_url: question.author?.avatar_url,
                          }}
                          title={question.title}
                          content={question.content}
                          category={
                            categories.find((c) => c.id === question.category)
                              ?.name || question.category
                          }
                          imageUrl={question.image_video_url}
                          linkUrl={question.link_url}
                          voteCount={
                            (voteCounts[question.id] ?? question.voteSum) ||
                            question.vote_count ||
                            0
                          }
                          commentCount={
                            question.comment_count || question.answerCount || 0
                          }
                          createdAt={question.created_at}
                          userVote={voteMap[question.id]}
                          onVote={handleVote}
                          userId={user?.id || null}
                          isSaved={false}
                          isOwner={
                            user?.id ===
                            (question.author?.id || question.user_id)
                          }
                          onEdit={() =>
                            router.push(`/questions/${question.id}/edit`)
                          }
                          onDelete={async () => {
                            if (
                              confirm(
                                "Ma hubtaa inaad rabto inaad tirtirto qoraalkan?",
                              )
                            ) {
                              const { success, error } = await deleteQuestion(
                                question.id,
                              );
                              if (success) {
                                toast.success("Qoraalka waa la tirtiray!");
                                fetchQuestions();
                              } else {
                                toast.error(error || "Khalad ayaa dhacay.");
                              }
                            }
                          }}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="glass-card rounded-2xl p-10 text-center">
                      <div className="text-5xl mb-4">🤔</div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        No questions found
                      </h3>
                      <p className="text-sm text-foreground-muted mb-6">
                        {selectedCategory === "all"
                          ? "Be the first to ask a question."
                          : "No questions in this category yet."}
                      </p>
                      {user && (
                        <Link href="/ask">
                          <Button variant="primary">
                            Ask the first question
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-5">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-subtle mb-4">
                Trending Topics
              </h3>
              <div className="space-y-2.5">
                {trendingTopics.map((topic, i) => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="flex items-center justify-between text-sm hover:text-foreground transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{topic.icon}</span>
                      <span className="text-foreground-muted group-hover:text-foreground transition-colors">
                        {topic.name}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-surface-muted text-foreground-subtle">
                      {topic.count ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-subtle mb-4">
                Active Members
              </h3>
              <div className="space-y-2.5">
                {activeUsers.length > 0 ? (
                  activeUsers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground-muted">
                        {member.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-primary-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-foreground-subtle">
                    Activity will appear here.
                  </p>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-subtle mb-4">
                Community Rules
              </h3>
              <ul className="space-y-2 text-sm text-foreground-muted">
                {[
                  "Respect all members",
                  "Share accurate information",
                  "Contribute constructively",
                  "Follow community guidelines",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <span className="text-primary-400 mt-0.5 text-xs">✦</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {!user && (
              <div className="glass-card rounded-2xl p-5 border-primary/20">
                <h3 className="text-sm font-bold text-foreground mb-2">
                  Join MIDEEYE
                </h3>
                <p className="text-xs text-foreground-muted mb-4 leading-relaxed">
                  Ask questions, share knowledge, and connect with the Somali
                  community.
                </p>
                <Link href="/auth/signup" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Create free account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {user && (
          <Link
            href="/ask"
            className="sm:hidden fixed bottom-5 right-4 z-40"
            aria-label="Weydii Su'aal"
          >
            <Button size="lg" className="rounded-full shadow-lg px-5">
              + Weydii
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
