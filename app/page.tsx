/**
 * MIDEEYE HOMEPAGE - CINEMATIC TRANSFORMATION
 *
 * A national Somali innovation movement.
 * A serious knowledge ecosystem.
 * A living community.
 *
 * NO template feel. NO flat sections. NO dead space.
 *
 * Design:
 * - Dark-to-teal gradient hero with floating shapes
 * - Glass-morphism elevated cards
 * - Layered backgrounds with depth
 * - Live community energy
 * - Wave dividers and gradient transitions
 * - Radial glows and soft blur overlays
 *
 * Migration-safe: Uses email.service abstraction
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";
import Skeleton from "@/components/ui/Skeleton";
import Alert from "@/components/ui/Alert";
import { MideeyeLogo, LogoIcon } from "@/components/brand/MideeyeLogo";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import LiveActivityFeed from "@/components/ui/LiveActivityFeed";
import { subscribeEmail } from "@/services/email.service";
import {
  getQuestions,
  type QuestionWithAuthor,
} from "@/services/question.service";
import { categories } from "@/utils/constants";
import { formatDate, truncateText } from "@/utils/helpers";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveUsers, setLiveUsers] = useState(847);
  const [showAlert, setShowAlert] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [latestPosts, setLatestPosts] = useState<QuestionWithAuthor[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Simulate live user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadLatestPosts = async () => {
      const data = await getQuestions();
      setLatestPosts(data.slice(0, 6));
      setLoadingPosts(false);
    };

    loadLatestPosts();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success } = await subscribeEmail(email);

    if (success) {
      setSubscribed(true);
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* ================================================ */}
      {/* HERO - FEATURED POSTS LAYOUT */}
      {/* ================================================ */}
      <section className="dark relative bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-surface-muted border border-border text-foreground-muted mb-3">
                Qoraalada ugu kulul maanta
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Akhri, falanqee, oo ka qayb qaado doodaha ugu muhiimsan
              </h1>
            </div>
            <Link href="/questions" className="sm:self-start">
              <Button variant="outline" size="sm" className="rounded-full">
                Eeg feed-ka oo dhan
              </Button>
            </Link>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              <Skeleton className="h-56 sm:h-72 md:h-[420px] md:col-span-7 rounded-xl" />
              <div className="md:col-span-5 grid grid-cols-1 gap-3 sm:gap-4">
                <Skeleton className="h-40 sm:h-48 rounded-xl" />
                <Skeleton className="h-40 sm:h-48 rounded-xl" />
              </div>
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              {latestPosts[0] && (
                <Link
                  href={`/questions/${latestPosts[0].id}`}
                  className="md:col-span-7"
                >
                  <Card hover className="h-full overflow-hidden group">
                    <div className="relative h-56 sm:h-72 md:h-[420px]">
                      {latestPosts[0].image_video_url ? (
                        <img
                          src={latestPosts[0].image_video_url}
                          alt={latestPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-700/30 to-accent-700/30" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary-600/90 text-primary-fg mb-2">
                          {categories.find(
                            (c) => c.id === latestPosts[0].category,
                          )?.name || latestPosts[0].category}
                        </span>
                        <h2 className="text-lg sm:text-2xl font-bold text-white line-clamp-2 mb-2">
                          {latestPosts[0].title}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/85 line-clamp-2 sm:line-clamp-3">
                          {truncateText(latestPosts[0].content, 180)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              <div className="md:col-span-5 grid grid-cols-1 gap-3 sm:gap-4">
                {latestPosts.slice(1, 4).map((post) => (
                  <Link key={post.id} href={`/questions/${post.id}`}>
                    <Card hover className="overflow-hidden h-full">
                      {post.image_video_url ? (
                        <div className="relative h-40 sm:h-48">
                          <img
                            src={post.image_video_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-600/90 text-white mb-1.5">
                              {categories.find((c) => c.id === post.category)
                                ?.name || post.category}
                            </span>
                            <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2">
                              {post.title}
                            </h3>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 sm:p-4">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary mb-2">
                            {categories.find((c) => c.id === post.category)
                              ?.name || post.category}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-2 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-foreground-muted line-clamp-3">
                            {post.content}
                          </p>
                          <div className="text-[11px] text-foreground-subtle mt-2">
                            {formatDate(post.created_at)}
                          </div>
                        </div>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-10 text-center">
              <p className="text-foreground-muted mb-4">
                Weli qoraalo lama helin.
              </p>
              <Link href="/ask">
                <Button>Weydii su'aashii ugu horreysay</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* ================================================ */}
      {/* GLASS-MORPHISM CATEGORY CARDS */}
      {/* ================================================ */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-surface relative">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1e3a8a 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              Qaybaha Aqooneed
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted max-w-2xl mx-auto">
              Dooro qaybta aad rabto oo la xiriir dadka khibradda leh
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Link href={`/topics/${category.id}`}>
                  <div className="group relative overflow-hidden p-5 sm:p-8 h-full cursor-pointer bg-surface border border-border hover:border-primary-400 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md">
                    {/* Subtle gradient background on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(59, 130, 246, 0.05) 100%)`,
                      }}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 transform group-hover:scale-105 transition-transform duration-300">
                        {category.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary-700 transition-colors">
                        {category.name}
                      </h3>

                      {/* English subtitle */}
                      <p className="text-sm text-foreground-muted uppercase tracking-wide mb-4 font-medium">
                        {category.nameEn}
                      </p>

                      {/* Hover arrow */}
                      <div className="flex items-center text-primary-600 font-semibold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                        <span>Eeg su'aalaha</span>
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient transition section */}
      <div className="h-32 bg-gradient-to-b from-surface via-surface-muted to-slate-900" />
      {/* ================================================ */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              Sida Ay U Shaqeyso
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted max-w-2xl mx-auto">
              Saddex tallaabo oo fudud oo ku gaadsiinaya jawaabaha aad u baahan
              tahay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                title: "Weydii Su'aalahaaga",
                description:
                  "Qor su'aashaada si cad oo faahfaahsan. Xulo qaybta ku habboon si dadka saxda ah u arkaan.",
              },
              {
                icon: "💬",
                title: "Hel Jawaabaha",
                description:
                  "Xubnaha khibradda leh ayaa ka jawaabi doona. Eeg jawaabaha kala duwan oo dooro tan ugu wanaagsan.",
              },
              {
                icon: "⭐",
                title: "Ku Codeey Jawaabaha",
                description:
                  "Door jawaabaha wanaagsan oo u codeey dadka ka caawiya. Dhis sumcad wanaagsan bulshada dhexdeeda.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-5 sm:p-6 h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* TRENDING QUESTIONS - COMMUNITY ENERGY */}
      {/* ================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-surface-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-foreground">
                Su'aalaha Ugu Firfircoon
              </h2>
              <p className="text-sm sm:text-base text-foreground-muted">
                Waxa maanta dadka badan ka hadlayaan
              </p>
            </div>
            <Link href="/questions">
              <Button variant="ghost">Wax Badan →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Sidee ayaan u baran karaa Python si degdeg ah?",
                author: "Ahmed M.",
                answers: 12,
                votes: 45,
                views: 234,
                category: "💻 Tignoolajiyada",
                status: "active",
              },
              {
                title: "Maxay yihiin fursadaha ganacsi ee Soomaaliya?",
                author: "Fatima A.",
                answers: 8,
                votes: 32,
                category: "💼 Ganacsi",
              },
              {
                title: "Miyuu Python yahay JavaScript-ka ka wanaagsan?",
                author: "Mohamed K.",
                answers: 24,
                votes: 78,
                category: "💻 Tignoolajiyada",
              },
              {
                title: "Sideen u aasi karaa shirkad Soomaaliya?",
                author: "Khadija H.",
                answers: 15,
                votes: 54,
                category: "💼 Ganacsi",
              },
            ].map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Vote count with tooltip */}
                    <Tooltip content="Total votes" position="top">
                      <div className="flex flex-col items-center gap-1 px-2">
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {question.votes}
                        </div>
                        <div className="text-xs text-foreground-subtle">
                          doorashooyin
                        </div>
                      </div>
                    </Tooltip>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {question.title}
                      </h3>
                      <div className="flex items-center flex-wrap gap-2 text-sm text-foreground-muted">
                        <Badge variant="primary" size="sm">
                          {question.category}
                        </Badge>
                        <Tooltip content={`${question.answers} total answers`}>
                          <span className="flex items-center gap-1">
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
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            {question.answers}
                          </span>
                        </Tooltip>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Avatar
                            fallback={question.author.charAt(0)}
                            size="xs"
                          />
                          {question.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* LIVE COMMUNITY ACTIVITY FEED */}
      {/* ================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Left side - Live Activity */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
                  Firfircoonida Bulshada
                </h2>
                <p className="text-foreground-muted">
                  Dadka ayaa had iyo jeer wax cusub wadaaga
                </p>
              </div>
              <LiveActivityFeed />
            </div>

            {/* Right side - Active Users Preview */}
            <div>
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
                  Xubnaha Firfircoon Maanta
                </h3>
                <p className="text-foreground-muted text-sm">
                  Dadka ka caawiya MIDEEYEta bulshada
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "Ahmed M.",
                    reputation: 1250,
                    initials: "AM",
                    status: "online",
                    contribution: "234 jawaabood",
                  },
                  {
                    name: "Fatima A.",
                    reputation: 980,
                    initials: "FA",
                    status: "online",
                    contribution: "189 jawaabood",
                  },
                  {
                    name: "Mohamed K.",
                    reputation: 756,
                    initials: "MK",
                    status: "active",
                    contribution: "142 jawaabood",
                  },
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-surface-muted rounded-lg border border-border hover:border-primary-400 transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <Avatar fallback={user.initials} size="md" />
                      {user.status === "online" && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-surface rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary-600 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-xs text-foreground-muted">
                        {user.contribution}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                        {user.reputation}
                      </div>
                      <div className="text-xs text-foreground-subtle">
                        sumcad
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center pt-4"
                >
                  <Link href="/community">
                    <Button variant="outline" size="sm">
                      Arki Dhammaan Xubnaha →
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* KNOWLEDGE AREAS - CATEGORIES GRID */}
      {/* ================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-surface-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Qaybaha Aqoon
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted">
              Dooro qaybta ku habboon oo hel dadka khibradda leh
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={`/topics/${category.id}`}>
                  <Card
                    hover
                    className={`p-4 sm:p-5 bg-gradient-to-br ${category.gradient} text-primary-fg cursor-pointer group`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-base mb-1 group-hover:scale-105 transition-transform">
                      {category.name}
                    </h3>
                    <p className="text-xs opacity-90">{category.nameEn}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* ACTIVE COMMUNITY MEMBERS */}
      {/* ================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Xubnaha Firfircoon
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted">
              Dadka ka caawiya MIDEEYEta bulshada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "Ahmed M.",
                answers: 234,
                reputation: 1250,
                avatar: "🧑‍💻",
              },
              {
                name: "Fatima A.",
                answers: 189,
                reputation: 980,
                avatar: "👩‍🏫",
              },
              {
                name: "Mohamed K.",
                answers: 167,
                reputation: 875,
                avatar: "👨‍💼",
              },
              {
                name: "Khadija H.",
                answers: 145,
                reputation: 720,
                avatar: "👩‍🔬",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card hover className="p-5 text-center">
                  <div className="text-5xl mb-3">{member.avatar}</div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-foreground-muted mb-3">
                    <span className="flex items-center gap-1">
                      <span className="text-accent-600">⭐</span>
                      {member.reputation}
                    </span>
                    <span>•</span>
                    <span>{member.answers} jawaab</span>
                  </div>
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Eeg Profile
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================ */}
      {/* EMAIL NEWSLETTER - GRADIENT BANNER */}
      {/* ================================================ */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6 sm:p-10 md:p-12 text-primary-foreground shadow-elevated"
          >
            {/* Decorative orb */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-surface/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Hel Ogeysiisyada Cusub
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-95 max-w-2xl mx-auto">
                Su'aalaha cusub, jawaabaha muhiimka ah, iyo wararka bulshada.
                Wixii cusub oo dhan emailkaaga ayey ku imaadaan.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface/20 backdrop-blur rounded-lg"
                >
                  <span className="text-2xl">✅</span>
                  <span className="text-lg font-medium">
                    Mahadsanid! Waad iska qortay.
                  </span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                >
                  <Input
                    type="email"
                    placeholder="emailkaaga@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-surface-elevated/90"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    isLoading={loading}
                    className="whitespace-nowrap shadow-button w-full sm:w-auto"
                  >
                    Ku Biir Hadda
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================ */}
      {/* FINAL CTA - STRONG CLOSE */}
      {/* ================================================ */}
      <section className="py-12 sm:py-20 px-4 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5">
              Diyaar Ma U Tahay Inaad{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Bilaabto?
              </span>
            </h2>
            <p className="text-base sm:text-xl text-foreground-muted mb-6 sm:mb-8 leading-relaxed">
              Ku biir kumanaanka xubnood ee MIDEEYEaya aqoonta bulshada
              Soomaaliyeed. Bilow maanta - waa bilaash!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:min-w-[200px] shadow-button"
                >
                  Samee Akoon Bilaash
                </Button>
              </Link>
              <Link href="/questions" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:min-w-[200px]"
                >
                  Daawasho Kaliya
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
              <p className="text-sm text-foreground-muted mb-4">
                La kalsoonaan tahay kumanaanka xubnood
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 opacity-50">
                <div className="flex -space-x-2">
                  {["🧑‍💻", "👩‍🏫", "👨‍💼", "👩‍🔬", "🧑‍🎓"].map((avatar, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center text-lg sm:text-xl"
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
                <div className="text-2xl">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
