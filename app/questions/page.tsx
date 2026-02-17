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
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
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
