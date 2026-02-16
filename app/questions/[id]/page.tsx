"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import LightboxImage from "@/components/ui/LightboxImage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  castVote,
  getVoteCountsForItems,
  getUserVotesForItems,
  removeVote,
} from "@/services/vote.service";
import { supabase } from "@/lib/supabase/client";
import { cn, formatDate } from "@/utils/helpers";
import { categories } from "@/utils/constants";
import type { Question, Answer, Profile } from "@/types";

type QuestionWithProfile = Question & { profiles?: Profile };
type AnswerWithProfile = Answer & { profiles?: Profile };
type AnswerNode = AnswerWithProfile & { children: AnswerNode[] };

const buildAnswerTree = (items: AnswerWithProfile[]): AnswerNode[] => {
  const nodes = new Map<string, AnswerNode>();
  items.forEach((item) => {
    nodes.set(item.id, { ...item, children: [] });
  });

  const roots: AnswerNode[] = [];
  nodes.forEach((node) => {
    if (node.parent_id && nodes.has(node.parent_id)) {
      nodes.get(node.parent_id)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [question, setQuestion] = useState<QuestionWithProfile | null>(null);
  const [answers, setAnswers] = useState<AnswerWithProfile[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voteValue, setVoteValue] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [collapsedThreads, setCollapsedThreads] = useState<
    Record<string, boolean>
  >({});
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [replySubmittingId, setReplySubmittingId] = useState<string | null>(
    null,
  );
  const [answerVoteCounts, setAnswerVoteCounts] = useState<
    Record<string, number>
  >({});
  const [answerVoteMap, setAnswerVoteMap] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
      fetchAnswers();
      incrementViewCount();
    }
  }, [params.id, user?.id]);

  const fetchQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*, profiles (*)")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setQuestion(data as QuestionWithProfile);
        setVoteCount(data.vote_count || 0);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select("*, profiles (*)")
        .eq("question_id", params.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        const ordered = [...(data as AnswerWithProfile[])].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        setAnswers(ordered);

        const ids = ordered.map((answer) => answer.id);
        const counts = await getVoteCountsForItems("answer", ids);
        setAnswerVoteCounts(counts);

        if (user) {
          const votes = await getUserVotesForItems(user.id, "answer", ids);
          setAnswerVoteMap(votes);
        } else {
          setAnswerVoteMap({});
        }
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const incrementViewCount = async () => {
    await supabase.rpc("increment_view_count", { question_id: params.id });
  };

  const loadUserVote = async (questionId: string) => {
    if (!user) {
      setVoteValue(0);
      return;
    }

    const votes = await getUserVotesForItems(user.id, "question", [questionId]);
    setVoteValue(votes[questionId] || 0);
  };

  useEffect(() => {
    if (question?.id) {
      loadUserVote(question.id);
    }
  }, [question?.id, user?.id]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAnswer.trim()) return;

    setSubmitting(true);
    const loadingToast = toast.loading("Jawaabta waa la diyaarinayaa...");

    try {
      const { error } = await supabase.from("answers").insert([
        {
          question_id: params.id as string,
          parent_id: null,
          user_id: user.id,
          content: newAnswer,
        },
      ]);

      if (!error) {
        toast.dismiss(loadingToast);
        toast.success("Jawaabta waa la dhiibay!");
        setNewAnswer("");
        fetchAnswers();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Khalad ayaa dhacay.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Khalad ayaa dhacay.");
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) return;
    const content = replyDrafts[parentId]?.trim();
    if (!content) return;

    setReplySubmittingId(parentId);
    const loadingToast = toast.loading("Jawaabta waa la diyaarinayaa...");

    try {
      const { error } = await supabase.from("answers").insert([
        {
          question_id: params.id as string,
          parent_id: parentId,
          user_id: user.id,
          content: content,
        },
      ]);

      if (!error) {
        toast.dismiss(loadingToast);
        toast.success("Jawaabta waa la dhiibay!");
        setReplyDrafts((prev) => ({ ...prev, [parentId]: "" }));
        setReplyOpen((prev) => ({ ...prev, [parentId]: false }));
        fetchAnswers();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Khalad ayaa dhacay.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Khalad ayaa dhacay.");
      console.error("Error submitting reply:", error);
    } finally {
      setReplySubmittingId(null);
    }
  };

  const handleCommentVote = async (answerId: string) => {
    if (!user) {
      toast.info("Fadlan gal si aad u door bixiso.");
      return;
    }

    const currentVote = answerVoteMap[answerId] || 0;
    const nextVote = currentVote === 1 ? 0 : 1;
    const currentCount = answerVoteCounts[answerId] || 0;
    const nextCount = currentCount - currentVote + nextVote;

    setAnswerVoteMap((prev) => ({ ...prev, [answerId]: nextVote }));
    setAnswerVoteCounts((prev) => ({ ...prev, [answerId]: nextCount }));

    const revert = () => {
      setAnswerVoteMap((prev) => ({ ...prev, [answerId]: currentVote }));
      setAnswerVoteCounts((prev) => ({ ...prev, [answerId]: currentCount }));
    };

    if (nextVote === 0) {
      const { error } = await removeVote(user.id, answerId, "answer");
      if (error) {
        toast.error("Khalad ayaa dhacay.");
        revert();
      }
      return;
    }

    if (nextVote === 1) {
      toast.success("Waxaad jeclaatay jawaabtan!");
    }

    const { error } = await castVote({
      userId: user.id,
      votableId: answerId,
      votableType: "answer",
      value: 1,
    });

    if (error) {
      toast.error("Khalad ayaa dhacay.");
      revert();
    }
  };

  const handleVote = async (value: number) => {
    if (!user || !question) {
      toast.info("Fadlan gal si aad u door bixiso.");
      return;
    }

    const currentVote = voteValue;
    const nextVote = currentVote === value ? 0 : value;
    const currentCount = voteCount;
    const nextCount = currentCount - currentVote + nextVote;

    setVoteValue(nextVote);
    setVoteCount(nextCount);

    const revert = () => {
      setVoteValue(currentVote);
      setVoteCount(currentCount);
    };

    if (nextVote === 0) {
      const { error } = await removeVote(user.id, question.id, "question");
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
      votableId: question.id,
      votableType: "question",
      value: nextVote,
    });

    if (error) {
      toast.error("Khalad ayaa dhacay.");
      revert();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold mb-2">Su'aasha lama helin</h3>
          <Button onClick={() => router.push("/questions")}>
            Ku laabo su'aalaha
          </Button>
        </Card>
      </div>
    );
  }

  const category = categories.find((c) => c.id === question.category);

  const answerTree = buildAnswerTree(answers);

  const renderAnswer = (answer: AnswerNode, depth = 0) => {
    const isCollapsed = collapsedThreads[answer.id];
    const isReplyOpen = replyOpen[answer.id];
    const childReplies = answer.children || [];
    const showAll = expandedReplies[answer.id];
    const visibleReplies = showAll ? childReplies : childReplies.slice(0, 2);
    const hiddenCount = childReplies.length - visibleReplies.length;

    return (
      <div
        key={answer.id}
        className={cn(
          "space-y-3",
          depth > 0 && "pl-4 border-l border-border-subtle",
        )}
      >
        <Card className={cn("p-5", depth > 0 && "bg-surface")}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-xs text-foreground-subtle mb-3">
                <span>{answer.profiles?.full_name || "Xubin"}</span>
                <span>•</span>
                <span>{formatDate(answer.created_at)}</span>
              </div>
              <p className="text-foreground whitespace-pre-wrap mb-4">
                {answer.content}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCommentVote(answer.id)}
                  className={cn(
                    "flex items-center gap-1.5 transition-all",
                    answerVoteMap[answer.id] === 1
                      ? "text-danger"
                      : "text-foreground-subtle hover:text-danger",
                  )}
                  aria-pressed={answerVoteMap[answer.id] === 1}
                  title={user ? "Like" : "Login to like"}
                >
                  {answerVoteMap[answer.id] === 1 ? (
                    <svg
                      className="w-4 h-4"
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
                      className="w-4 h-4"
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
                    {answerVoteCounts[answer.id] || 0}
                  </span>
                </motion.button>
                <button
                  type="button"
                  onClick={() =>
                    setReplyOpen((prev) => ({
                      ...prev,
                      [answer.id]: !prev[answer.id],
                    }))
                  }
                  className="text-foreground-subtle hover:text-foreground transition-colors"
                >
                  Jawaab
                </button>
                {childReplies.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsedThreads((prev) => ({
                        ...prev,
                        [answer.id]: !prev[answer.id],
                      }))
                    }
                    className="text-foreground-subtle hover:text-foreground transition-colors"
                  >
                    {isCollapsed
                      ? `Muuji ${childReplies.length} jawaabood`
                      : "Qari jawaabaha"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {isReplyOpen && (
            <div className="mt-4">
              <Textarea
                value={replyDrafts[answer.id] || ""}
                onChange={(e) =>
                  setReplyDrafts((prev) => ({
                    ...prev,
                    [answer.id]: e.target.value,
                  }))
                }
                placeholder="Qor jawaabtaada..."
                rows={3}
                className="mb-3"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  isLoading={replySubmittingId === answer.id}
                  onClick={() => handleSubmitReply(answer.id)}
                >
                  Soo Dir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setReplyOpen((prev) => ({ ...prev, [answer.id]: false }))
                  }
                >
                  Jooji
                </Button>
              </div>
            </div>
          )}
        </Card>

        {!isCollapsed && childReplies.length > 0 && (
          <div className="space-y-3">
            {visibleReplies.map((child) => renderAnswer(child, depth + 1))}
            {hiddenCount > 0 && !showAll && (
              <button
                type="button"
                onClick={() =>
                  setExpandedReplies((prev) => ({
                    ...prev,
                    [answer.id]: true,
                  }))
                }
                className="text-xs text-foreground-subtle hover:text-foreground transition-colors"
              >
                Muuji jawaabaha kale ({hiddenCount})
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <div className="p-8">
              <div className="flex-1">
                {category && (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.gradient} text-primary-foreground mb-4`}
                  >
                    {category.icon} {category.name}
                  </span>
                )}

                <h1 className="text-3xl font-bold mb-4">{question.title}</h1>

                <div className="prose max-w-none mb-6">
                  <p className="text-foreground whitespace-pre-wrap">
                    {question.content}
                  </p>
                </div>

                {question.image_video_url && (
                  <div className="mb-6">
                    <LightboxImage
                      src={question.image_video_url}
                      alt={question.title}
                      className="border border-border"
                      aspectRatio="16 / 9"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(1)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      voteValue === 1
                        ? "bg-danger/10 text-danger"
                        : "bg-surface-muted text-foreground-subtle hover:bg-surface-muted/60 hover:text-danger"
                    }`}
                    aria-pressed={voteValue === 1}
                    title={user ? "Like" : "Login to like"}
                  >
                    {voteValue === 1 ? (
                      <svg
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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
                    <span className="font-semibold text-base">{voteCount}</span>
                  </motion.button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted text-foreground-subtle">
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
                    <span className="font-medium">{answers.length}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted text-foreground-subtle">
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
                    <span className="font-medium">{question.view_count}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground-subtle text-sm ml-auto">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{question.profiles?.full_name || "Xubin"}</span>
                    <span className="ml-2">
                      • {formatDate(question.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Answers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold mb-4">
            {answers.length} Jawaab{answers.length !== 1 ? "ood" : ""}
          </h2>

          <div className="space-y-4">
            {answerTree.length > 0 ? (
              answerTree.map((answer, index) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {renderAnswer(answer)}
                </motion.div>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-foreground-muted">Jawaab wali lama helin.</p>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Answer Form */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Jawaabta Bixi</h3>
              <form onSubmit={handleSubmitAnswer}>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Halkan ku qor jawaabta..."
                  rows={6}
                  className="mb-4"
                  required
                />
                <Button type="submit" isLoading={submitting}>
                  Soo Dir Jawaabta
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-foreground-muted mb-4">
              Waa inaad gashaa si aad jawaab u bixiso
            </p>
            <Button onClick={() => router.push("/auth/login")}>Gal</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
