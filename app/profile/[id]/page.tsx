"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";
import { categories } from "@/utils/constants";
import { formatDate, truncateText } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  getQuestions,
  type QuestionWithAuthor,
} from "@/services/question.service";
import { getAnswersByUserId } from "@/services/answer.service";
import { getUserReputation, getUserStats } from "@/services/user.service";
import type { Answer } from "@/types";
import FollowButton from "@/components/ui/FollowButton";

const STORAGE_KEY = "MIDEEYE-joined-topics";

type JoinedState = Record<string, boolean>;

type Badge = {
  id: string;
  label: string;
  description: string;
};

export default function ProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const profileId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { profile, loading: profileLoading } = useProfile(profileId);

  const [stats, setStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    totalVotes: 0,
  });
  const [reputation, setReputation] = useState(0);
  const [posts, setPosts] = useState<QuestionWithAuthor[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<JoinedState>({});

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
    const load = async () => {
      if (!profileId) return;
      const [userStats, reputationScore, userPosts, userAnswers] =
        await Promise.all([
          getUserStats(profileId),
          getUserReputation(profileId),
          getQuestions({ userId: profileId }),
          getAnswersByUserId(profileId),
        ]);

      setStats(userStats);
      setReputation(reputationScore);
      setPosts(userPosts.slice(0, 5));
      setAnswers(userAnswers.slice(0, 5));
      setLoading(false);
    };

    load();
  }, [profileId]);

  const joinedCommunities = useMemo(
    () => categories.filter((category) => joined[category.id]),
    [joined],
  );

  const badges: Badge[] = useMemo(() => {
    const list: Badge[] = [];
    if (reputation >= 50) {
      list.push({
        id: "starter",
        label: "Bilow",
        description: "50+ sumcad",
      });
    }
    if (reputation >= 200) {
      list.push({
        id: "mentor",
        label: "Mentor",
        description: "200+ sumcad",
      });
    }
    if (reputation >= 500) {
      list.push({
        id: "leader",
        label: "Hoggaamiye",
        description: "500+ sumcad",
      });
    }
    if (stats.answersGiven >= 25) {
      list.push({
        id: "helper",
        label: "Caawiye",
        description: "25+ jawaab",
      });
    }
    if (stats.questionsAsked >= 10) {
      list.push({
        id: "curious",
        label: "Xiise",
        description: "10+ su'aal",
      });
    }
    if (list.length === 0) {
      list.push({
        id: "new",
        label: "Cusub",
        description: "Bilow safarka",
      });
    }
    return list;
  }, [reputation, stats.answersGiven, stats.questionsAsked]);

  if (profileLoading || loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Profile lama helin</h2>
          <Link href="/questions" className="text-foreground-muted">
            Ku laabo quudinta
          </Link>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === profileId;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-44 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center text-3xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || "User"}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span>🧑‍💻</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground">
                  {profile.fullName || "Xubin"}
                </h1>
                <p className="text-sm text-primary-foreground/80">
                  {profile.bio || "Ku soo dhawow bogga sumcaddaada."}
                </p>
              </div>
            </div>
            {!isOwner && (
              <div className="hidden sm:block">
                <FollowButton userId={profileId} size="lg" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-3xl font-bold">{reputation}</div>
                    <div className="text-sm text-foreground-muted">Sumcad</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {stats.questionsAsked}
                    </div>
                    <div className="text-sm text-foreground-muted">Qoraalo</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {stats.answersGiven}
                    </div>
                    <div className="text-sm text-foreground-muted">Jawaabo</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stats.totalVotes}</div>
                    <div className="text-sm text-foreground-muted">Codad</div>
                  </div>
                </div>

                {/* Mobile Follow Button */}
                {!isOwner && (
                  <div className="sm:hidden mt-4">
                    <FollowButton
                      userId={profileId}
                      size="md"
                      className="w-full"
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <span
                      key={badge.id}
                      className="px-3 py-1 rounded-full text-xs border border-border bg-surface-muted text-foreground-muted"
                      title={badge.description}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Hawlaha Ugu Dambeeyay</h2>
                {isOwner && (
                  <Link href="/ask" className="text-sm text-foreground-muted">
                    Qor qoraal cusub
                  </Link>
                )}
              </div>

              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl border border-border"
                    >
                      <Link href={`/questions/${post.id}`}>
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-foreground-muted mb-2 line-clamp-2">
                        {truncateText(post.content, 140)}
                      </p>
                      <div className="text-xs text-foreground-subtle">
                        {formatDate(post.created_at)} •{" "}
                        {post.comment_count || post.answerCount || 0} jawaab
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground-muted">
                    Qoraal wali lama hayo.
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Jawaabaha</h2>
              <div className="space-y-4">
                {answers.length > 0 ? (
                  answers.map((answer) => (
                    <div
                      key={answer.id}
                      className="p-4 rounded-xl border border-border"
                    >
                      <p className="text-sm text-foreground-muted mb-2 line-clamp-2">
                        {truncateText(answer.content, 140)}
                      </p>
                      <div className="text-xs text-foreground-subtle">
                        {formatDate(answer.created_at)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground-muted">
                    Jawaab wali lama hayo.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Xogta
              </h3>
              <div className="space-y-2 text-sm text-foreground-subtle">
                <div className="flex items-center justify-between">
                  <span>Ku biiray</span>
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email</span>
                  <span>{profile.email}</span>
                </div>
              </div>
              {isOwner && (
                <Link href="/settings/profile">
                  <Button className="mt-5 w-full" variant="outline">
                    Cusboonaysii Profile
                  </Button>
                </Link>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Bulshooyinka
              </h3>
              {joinedCommunities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {joinedCommunities.map((community) => (
                    <Link
                      key={community.id}
                      href={`/topics/${community.id}`}
                      className="px-3 py-1 rounded-full text-xs border border-border bg-surface-muted text-foreground-muted hover:text-foreground hover:border-border-strong transition-colors"
                    >
                      {community.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground-muted">
                  Bulsho wali kuma biirin.
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground-muted mb-4">
                Talooyin
              </h3>
              <ul className="space-y-2 text-sm text-foreground-subtle">
                <li>• Ka qayb qaado doodaha cusub</li>
                <li>• Dhis sumcad adigoo caawiya</li>
                <li>• Ku biir bulshooyin cusub</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
