/**
 * Dashboard Page
 *
 * Uses service layer for all data operations.
 * No direct Supabase calls - ready for Django migration.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/useToast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PostCard from "@/components/ui/PostCard";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import FloatingShapes from "@/components/layout/FloatingShapes";
import { categories } from "@/utils/constants";
import { getUserStats } from "@/services/user.service";
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const toast = useToast();
  const [userPosts, setUserPosts] = useState<QuestionWithAuthor[]>([]);
  const [recentQuestions, setRecentQuestions] = useState<QuestionWithAuthor[]>(
    [],
  );
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [voteMap, setVoteMap] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    totalVotes: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchUserPosts();
      fetchRecentQuestions();

      // Subscribe to real-time question updates
      // When migrating to Django, this will use WebSocket
      const subscription = subscribeToQuestions(() => {
        fetchUserPosts();
        fetchRecentQuestions();
      });

      return () => subscription.unsubscribe();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    // Using user service - when migrating to Django, only service layer changes
    const userStats = await getUserStats(user.id);
    setStats(userStats);
  };

  const fetchUserPosts = async () => {
    if (!user) return;
    const posts = await getQuestions({ userId: user.id });
    setUserPosts(posts);

    // Add to vote counts
    setVoteCounts((prev) => ({
      ...prev,
      ...posts.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.voteSum || item.vote_count || 0;
        return acc;
      }, {}),
    }));

    if (user) {
      const votes = await getUserVotesForItems(
        user.id,
        "question",
        posts.map((item) => item.id),
      );
      setVoteMap((prev) => ({ ...prev, ...votes }));
    }
  };

  const fetchRecentQuestions = async () => {
    // Using question service - when migrating to Django, only service layer changes
    const questions = await getQuestions();
    const recentQuestions = questions.slice(0, 5);
    setRecentQuestions(recentQuestions);
    setVoteCounts((prev) => ({
      ...prev,
      ...recentQuestions.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.voteSum || item.vote_count || 0;
        return acc;
      }, {}),
    }));

    if (user) {
      const votes = await getUserVotesForItems(
        user.id,
        "question",
        recentQuestions.map((item) => item.id),
      );
      setVoteMap((prev) => ({ ...prev, ...votes }));
    } else {
      setVoteMap({});
    }
  };

  const handleVote = async (questionId: string, value: number) => {
    if (!user) {
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
        revert();
      }
      return;
    }

    const { error } = await castVote({
      userId: user.id,
      votableId: questionId,
      votableType: "question",
      value: nextVote,
    });

    if (error) {
      revert();
    }
  };

  if (authLoading || profileLoading) {
    return <DashboardSkeleton />;
  }

  if (!user || !profile) {
    return null;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Subax wanaagsan";
    return "Fiid wanaagsan";
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            {greeting()}, {profile.fullName || "Xubin"}! 👋
          </h1>
          <p className="text-foreground-muted text-lg">
            Maxaad maanta baranaysaa?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            {
              label: "Su'aalaha",
              value: stats.questionsAsked,
              icon: "❓",
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Jawaabaha",
              value: stats.answersGiven,
              icon: "💡",
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Doorashada",
              value: stats.totalVotes,
              icon: "⬆️",
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-3 sm:p-4">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-lg sm:text-xl mb-2 sm:mb-3`}
                >
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl font-bold mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-foreground-muted">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Ficilo Degdeg ah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/ask">
              <Card hover className="p-6 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">❓</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Weydii Su'aal</h3>
                    <p className="text-foreground-muted">
                      Weydii su'aal cusub bulshada
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/questions">
              <Card hover className="p-6 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📚</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Eeg Su'aalaha</h3>
                    <p className="text-foreground-muted">
                      Raadi su'aalaha cusub
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* User's Posts */}
        {userPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Qoraalkayga</h2>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Dhamaan eeg →
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {userPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <PostCard
                    id={post.id}
                    author={{
                      id: post.author?.id || post.user_id,
                      fullName: post.author?.fullName || "Xubin",
                      avatar_url: post.author?.avatar_url,
                    }}
                    title={post.title}
                    content={post.content}
                    category={
                      categories.find((c) => c.id === post.category)?.name ||
                      post.category
                    }
                    imageUrl={post.image_video_url}
                    linkUrl={post.link_url}
                    voteCount={
                      (voteCounts[post.id] ?? post.voteSum) ||
                      post.vote_count ||
                      0
                    }
                    commentCount={post.comment_count || post.answerCount || 0}
                    createdAt={post.created_at}
                    userVote={voteMap[post.id]}
                    onVote={handleVote}
                    isOwner={true}
                    onEdit={() => router.push(`/questions/${post.id}/edit`)}
                    onDelete={async () => {
                      if (
                        confirm(
                          "Ma hubtaa inaad rabto inaad tirtirto qoraalkan?",
                        )
                      ) {
                        const { success, error } = await deleteQuestion(
                          post.id,
                        );
                        if (success) {
                          toast.success("Qoraalka waa la tirtiray!");
                          fetchUserPosts();
                        } else {
                          toast.error(error || "Khalad ayaa dhacay.");
                        }
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Qaybaha</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={category.id} href={`/topics/${category.id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${category.gradient} rounded-xl p-4 text-primary-foreground cursor-pointer text-center`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-sm">{category.name}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Su'aalaha Cusub</h2>
            <Link href="/questions">
              <Button variant="ghost" size="sm">
                Dhamaan eeg →
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentQuestions.length > 0 ? (
              recentQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
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
                  />
                </motion.div>
              ))
            ) : (
              <Card className="p-8 text-center text-foreground-subtle">
                <p>Su'aalo cusub ma jiraan hadda. Noqo kii ugu horreya!</p>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
