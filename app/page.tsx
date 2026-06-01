/**
 * MIDEEYE HOMEPAGE — XIDDIG DESIGN SYSTEM
 * The Somali Knowledge Network
 */
"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { LogoIcon } from "@/components/brand/MideeyeLogo";
import { subscribeEmail } from "@/services/email.service";
import {
  getQuestions,
  type QuestionWithAuthor,
} from "@/services/question.service";
import { categories } from "@/utils/constants";
import { formatDate } from "@/utils/helpers";

// --- Animated Number Counter --------------------------------------------------
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// --- Category icon map --------------------------------------------------------
const CATEGORY_ICONS: Record<string, string> = {
  Technology: "💻",
  Business: "📈",
  Education: "🎓",
  Health: "🏥",
  Culture: "🎭",
  Politics: "🏛️",
  Sports: "⚽",
  Religion: "🕌",
  Science: "🔬",
  Arts: "🎨",
  Travel: "✈️",
  Food: "🍽️",
};

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<QuestionWithAuthor[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getQuestions({ sortBy: "hot", limit: 6 } as Parameters<
      typeof getQuestions
    >[0])
      .then((data) => {
        setFeaturedPosts(Array.isArray(data) ? data.slice(0, 6) : []);
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    const { success } = await subscribeEmail(email);
    if (success) {
      setSubscribed(true);
      setEmail("");
    }
    setSubLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ---------------------------------------------------
          HERO — Cinematic dark viewport
      --------------------------------------------------- */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #070B16 0%, #0A1020 55%, #0D1530 100%)" }}
      >
        {/* Deep teal core glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "30%", left: "50%", transform: "translate(-50%, -50%)",
            width: 900, height: 700,
            background: "radial-gradient(ellipse, rgba(0,212,163,0.10) 0%, rgba(0,212,163,0.03) 45%, transparent 70%)",
            filter: "blur(1px)",
          }}
        />
        {/* Gold accent glow top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -60, right: -80,
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(251,182,46,0.08) 0%, transparent 65%)",
          }}
        />
        {/* Blue depth glow bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -40, left: -60,
            width: 500, height: 400,
            background: "radial-gradient(circle, rgba(26,76,224,0.07) 0%, transparent 65%)",
          }}
        />

        {/* Geometric dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,212,163,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            opacity: 0.35,
          }}
        />

        {/* Floating particles */}
        {[
          { top: "18%", left: "9%",  size: 3, color: "#00D4A3", duration: 4,   delay: 0   },
          { top: "28%", right: "11%", size: 2, color: "#FBB62E", duration: 3.5, delay: 0.8 },
          { top: "65%", left: "18%", size: 2, color: "#00D4A3", duration: 5,   delay: 1.6 },
          { top: "72%", right: "20%", size: 4, color: "#FBB62E", duration: 4.5, delay: 0.4 },
          { top: "45%", left: "5%",  size: 1.5, color: "#00BA8D", duration: 6,  delay: 2   },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size, height: p.size,
              background: p.color,
              top: p.top, left: (p as any).left, right: (p as any).right,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: p.duration, ease: "easeInOut", delay: p.delay }}
          />
        ))}

        {/* ── CONTENT ── */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center py-32">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(0,212,163,0.08)",
                border: "1px solid rgba(0,212,163,0.22)",
                color: "#00D4A3",
                letterSpacing: "0.04em",
              }}
            >
              <LogoIcon size={18} />
              Xiddig · The Somali Knowledge Network
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-heading font-extrabold leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            <span style={{ color: "#F0F4FF" }}>Where Somalis</span>
            <br />
            <span
              style={{
                background: "linear-gradient(120deg, #00D4A3 0%, #00BA8D 40%, #FBB62E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Share Knowledge
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: "rgba(160,180,220,0.85)" }}
          >
            Ask questions, share expertise, and discover insights from
            the global Somali community — in 31 countries and growing.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
          >
            <Link href="/auth/signup">
              <button
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #00D4A3 0%, #00BA8D 100%)",
                  color: "#050A12",
                  boxShadow: "0 0 28px rgba(0,212,163,0.30), 0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                Get Started — It's Free
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </Link>
            <Link href="/questions">
              <button
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(220,235,255,0.9)",
                }}
              >
                Browse Questions
              </button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-0"
          >
            {[
              { value: 12400, suffix: "+", label: "Questions" },
              { value: 8200,  suffix: "+", label: "Members"   },
              { value: 31,    suffix: "",  label: "Countries"  },
              { value: 24,    suffix: "",  label: "Topics"     },
            ].map(({ value, suffix, label }, i) => (
              <div key={label} className="flex items-center">
                <div className="px-6 py-3 text-center">
                  <div
                    className="text-2xl sm:text-3xl font-extrabold font-heading tabular-nums"
                    style={{
                      background: "linear-gradient(120deg, #00D4A3 0%, #FBB62E 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <Counter to={value} suffix={suffix} />
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-[0.12em] mt-0.5 font-medium"
                    style={{ color: "rgba(140,165,200,0.8)" }}
                  >
                    {label}
                  </div>
                </div>
                {i < 3 && (
                  <div
                    className="hidden sm:block h-8 w-px"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade into page */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgb(var(--color-background)), transparent)" }}
        />
      </section>

      {/* ---------------------------------------------------
          TOPICS — dark card grid
      --------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-2">
              Explore Topics
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
              Every field of knowledge
            </p>
          </div>
          <Link href="/topics">
            <span className="text-sm text-primary-400 hover:text-primary transition-colors font-medium hidden sm:inline">
              All topics →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(Array.isArray(categories) ? categories : [])
            .slice(0, 8)
            .map((cat, i) => {
              const name =
                typeof cat === "string" ? cat : (cat as { name: string }).name;
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link href={`/topics?category=${encodeURIComponent(name)}`}>
                    <div
                      className="group glass-card rounded-2xl p-4 hover:border-primary/30 hover:-translate-y-1
                    transition-all duration-200 cursor-pointer text-center"
                    >
                      <span className="text-2xl mb-2 block">
                        {CATEGORY_ICONS[name] || "??"}
                      </span>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary-400 transition-colors">
                        {name}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
        </div>
      </section>

      {/* ---------------------------------------------------
          FEATURED QUESTIONS — magazine layout
      --------------------------------------------------- */}
      {featuredPosts.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-border/30">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-400 mb-2">
                Trending Now
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
                Hottest questions today
              </p>
            </div>
            <Link href="/questions">
              <span className="text-sm text-primary-400 hover:text-primary transition-colors font-medium hidden sm:inline">
                View all ?
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link href={`/questions/${post.id}`}>
                  <div
                    className="group glass-card rounded-2xl p-5 hover:border-primary/25 hover:-translate-y-1
                    transition-all duration-200 cursor-pointer h-full flex flex-col"
                  >
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-md bg-primary/10 text-primary-400
                      text-[10px] font-bold uppercase tracking-wide mb-3 w-fit"
                    >
                      {post.category}
                    </span>
                    <h3
                      className="text-base font-bold text-foreground group-hover:text-primary-400
                      transition-colors line-clamp-2 leading-snug mb-3 flex-1"
                    >
                      {post.title}
                    </h3>
                    {post.content && (
                      <p className="text-sm text-foreground-muted line-clamp-2 mb-4 leading-relaxed">
                        {post.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/40">
                      <Avatar
                        src={post.author?.avatar_url || undefined}
                        alt={post.author?.fullName || "User"}
                        size="xs"
                        className="w-6 h-6"
                      />
                      <span className="text-xs text-foreground-subtle flex-1 truncate">
                        {post.author?.fullName || "User"}
                      </span>
                      <div className="flex items-center gap-2.5 text-xs text-foreground-subtle">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {post.vote_count ?? 0}
                        </span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------
          JOIN CTA — dramatic dark section
      --------------------------------------------------- */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden border-t border-border/30">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px]
            rounded-full bg-primary/8 blur-[100px]"
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <LogoIcon size={48} className="mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground mb-4 leading-tight">
              Join the Somali
              <br />
              <span className="text-gradient">Knowledge Movement</span>
            </h2>
            <p className="text-foreground-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Be part of a growing community of thinkers, learners, and creators
              building the digital knowledge hub of the Somali world.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/15 border border-primary/30 text-primary-400 font-semibold">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                You're on the list — welcome!
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <Link href="/auth/signup">
                  <Button variant="primary" size="lg">
                    Create Free Account
                  </Button>
                </Link>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="or enter your email..."
                    required
                    className="px-4 py-2.5 text-sm rounded-xl bg-surface-elevated border border-border
                      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                      placeholder-foreground-subtle w-56"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    isLoading={subLoading}
                  >
                    Notify me
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
