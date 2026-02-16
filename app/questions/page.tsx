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
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import LightboxImage from "@/components/ui/LightboxImage";
import { categories } from "@/utils/constants";
import { formatDate, getHotScore, truncateText } from "@/utils/helpers";
import {
  getQuestions,
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
  const toast = useToast();
  const [questions, setQuestions] = useState<QuestionWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [voteMap, setVoteMap] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [topRange, setTopRange] = useState<"24h" | "7d" | "all">("24h");

  const postTypeLabels: Record<string, string> = {
    question: "Su'aal",
    discussion: "Dood",
    media: "Sawir",
    resource: "Khayraad",
    announcement: "Ogeysiis",
  };

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
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                Su'aalaha
              </h1>
              <p className="text-sm sm:text-base text-foreground-muted">
                Helka jawaabo su'aalahaada
              </p>
            </div>
            {user && (
              <Link href="/ask" className="hidden sm:block">
                <Button size="lg">Weydii Su'aal</Button>
              </Link>
            )}
          </div>

          <div className="sticky top-14 z-30 -mx-3 px-3 sm:mx-0 sm:px-0 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-y border-border/60 sm:border-y-0">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
              <Button
                variant={selectedCategory === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="whitespace-nowrap rounded-full snap-start"
              >
                Dhammaan
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "primary" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap rounded-full snap-start"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Button
                size="sm"
                variant={sortBy === "hot" ? "primary" : "outline"}
                onClick={() => setSortBy("hot")}
                className="rounded-full"
              >
                Hot
              </Button>
              <Button
                size="sm"
                variant={sortBy === "new" ? "primary" : "outline"}
                onClick={() => setSortBy("new")}
                className="rounded-full"
              >
                New
              </Button>
              <Button
                size="sm"
                variant={sortBy === "top" ? "primary" : "outline"}
                onClick={() => setSortBy("top")}
                className="rounded-full"
              >
                Top
              </Button>

              {sortBy === "top" && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={topRange === "24h" ? "primary" : "outline"}
                    onClick={() => setTopRange("24h")}
                    className="rounded-full"
                  >
                    24h
                  </Button>
                  <Button
                    size="sm"
                    variant={topRange === "7d" ? "primary" : "outline"}
                    onClick={() => setTopRange("7d")}
                    className="rounded-full"
                  >
                    7d
                  </Button>
                  <Button
                    size="sm"
                    variant={topRange === "all" ? "primary" : "outline"}
                    onClick={() => setTopRange("all")}
                    className="rounded-full"
                  >
                    All
                  </Button>
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
              <LoadingSkeleton />
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
                        <Card
                          hover
                          className="overflow-hidden transition-all hover:-translate-y-0.5 hover:bg-surface"
                        >
                          <div className="p-4 sm:p-6">
                            {/* Post Content */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-foreground-subtle mb-2.5 sm:mb-3">
                                <span className="px-2 py-1 rounded-full bg-surface-muted border border-border text-foreground-muted">
                                  {postTypeLabels[
                                    question.post_type || "question"
                                  ] || "Qoraal"}
                                </span>
                                <span className="text-foreground-subtle">
                                  •
                                </span>
                                <span>
                                  {question.author?.fullName || "Xubin"}
                                </span>
                                <span className="text-foreground-subtle">
                                  •
                                </span>
                                <span>{formatDate(question.created_at)}</span>
                              </div>

                              <Link href={`/questions/${question.id}`}>
                                <h3 className="font-bold text-lg sm:text-xl mb-2.5 sm:mb-3 hover:text-primary transition-colors leading-tight">
                                  {question.title}
                                </h3>
                              </Link>

                              <p className="text-sm sm:text-base text-foreground-muted mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                                {truncateText(question.content, 240)}
                              </p>

                              {question.image_video_url && (
                                <div className="mb-4">
                                  <LightboxImage
                                    src={question.image_video_url}
                                    alt={question.title}
                                    className="border border-border"
                                    aspectRatio="16 / 9"
                                  />
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-foreground-subtle mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-gradient-to-r ${
                                    categories.find(
                                      (c) => c.id === question.category,
                                    )?.gradient ||
                                    "from-primary-600 to-accent-600"
                                  } text-primary-foreground`}
                                >
                                  {categories.find(
                                    (c) => c.id === question.category,
                                  )?.name || question.category}
                                </span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleVote(question.id, 1)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all ${
                                    voteMap[question.id] === 1
                                      ? "text-danger border-danger/30 bg-danger/10"
                                      : "text-foreground-subtle border-border hover:text-danger hover:border-danger/30"
                                  }`}
                                  aria-pressed={voteMap[question.id] === 1}
                                  title={user ? "Like" : "Login to like"}
                                >
                                  {voteMap[question.id] === 1 ? (
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
                                    {(voteCounts[question.id] ??
                                      question.voteSum) ||
                                      question.vote_count ||
                                      0}
                                  </span>
                                </motion.button>
                                <Link
                                  href={`/questions/${question.id}`}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border text-foreground-subtle hover:text-primary hover:border-primary/30 transition-colors"
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
                                    {question.comment_count ||
                                      question.answerCount ||
                                      0}
                                  </span>
                                </Link>
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border">
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
                                  <span>{question.view_count}</span>
                                </span>
                                <div className="ml-auto hidden sm:flex items-center gap-3">
                                  <button
                                    type="button"
                                    className="text-xs text-foreground-subtle hover:text-foreground transition-colors"
                                  >
                                    Kaydi
                                  </button>
                                  <button
                                    type="button"
                                    className="text-xs text-foreground-subtle hover:text-foreground transition-colors"
                                  >
                                    Wadaag
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card className="p-8 sm:p-12 text-center">
                      <div className="text-6xl mb-4">🤔</div>
                      <h3 className="text-xl font-bold mb-2">
                        Suaalo lama helin
                      </h3>
                      <p className="text-foreground-muted mb-6">
                        {selectedCategory === "all"
                          ? "Suaalo cusub ma jiraan hadda."
                          : "Suaalo qaybtan kuma jiraan hadda."}
                      </p>
                      {user && (
                        <Link href="/ask">
                          <Button>Noqo kii ugu horreya ee suaal weydiya</Button>
                        </Link>
                      )}
                    </Card>
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Mawduucyada Kulul
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="flex items-center justify-between text-sm hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{topic.icon}</span>
                      <span className="text-foreground">{topic.name}</span>
                    </div>
                    <span className="text-foreground-subtle">
                      {topic.count ?? 0}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Xubno Firfircoon
              </h3>
              <div className="space-y-3">
                {activeUsers.length > 0 ? (
                  activeUsers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground">{member.name}</span>
                      <span className="text-foreground-subtle">Online</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground-subtle">
                    Xogta firfircoonida ayaa soo muuqan doonta.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Xeerarka Bulshada
              </h3>
              <ul className="space-y-2 text-sm text-foreground-subtle">
                <li>• Ixtiraam dadka kale</li>
                <li>• Ka fogow faafin aan xaqiiqo ahayn</li>
                <li>• La wadaag xog wax tar leh</li>
                <li>• Ha ku xadgudbin xeerarka</li>
              </ul>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Qaybaha La Taliyay
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/topics/${category.id}`}
                    className="px-3 py-1 rounded-full text-xs border border-border bg-surface-muted text-foreground-muted hover:text-foreground hover:border-border-strong transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </Card>
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
