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
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import FloatingShapes from "@/components/layout/FloatingShapes";
import { categories } from "@/utils/constants";
import { getUserStats } from "@/services/user.service";
import { getQuestions } from "@/services/question.service";
import { subscribeToQuestions } from "@/services/realtime.service";
import type { Question } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
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
      fetchRecentQuestions();

      // Subscribe to real-time question updates
      // When migrating to Django, this will use WebSocket
      const subscription = subscribeToQuestions(() => {
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

  const fetchRecentQuestions = async () => {
    // Using question service - when migrating to Django, only service layer changes
    const questions = await getQuestions();
    setRecentQuestions(questions.slice(0, 5));
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Suaalaha aad weydiisay",
              value: stats.questionsAsked,
              icon: "❓",
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Jawaabaha aad bixisay",
              value: stats.answersGiven,
              icon: "💡",
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Doorashooyinka",
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
              <Card hover className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-foreground-muted">{stat.label}</div>
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

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.5 }}
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
                  <Link href={`/questions/${question.id}`}>
                    <Card hover className="p-6">
                      <h3 className="font-bold text-lg mb-2 hover:text-primary-600">
                        {question.title}
                      </h3>
                      <p className="text-foreground-muted mb-4 line-clamp-2">
                        {question.content}
                      </p>
                      <div className="flex gap-4 text-sm text-foreground-subtle">
                        <span>🔖 {question.category}</span>
                        <span>👁️ {question.view_count} daawasho</span>
                      </div>
                    </Card>
                  </Link>
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
