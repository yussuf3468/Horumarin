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
import { getQuestions, type QuestionWithAuthor } from "@/services/question.service";
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
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// --- Category icon map --------------------------------------------------------
const CATEGORY_ICONS: Record<string, string> = {
  "Technology": "??", "Business": "??", "Education": "??", "Health": "??",
  "Culture": "??", "Politics": "???", "Sports": "?", "Religion": "??",
  "Science": "??", "Arts": "??", "Travel": "??", "Food": "???",
};

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<QuestionWithAuthor[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getQuestions({ sortBy: "hot", limit: 6 } as Parameters<typeof getQuestions>[0]).then(data => {
      setFeaturedPosts(Array.isArray(data) ? data.slice(0, 6) : []);
    }).catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    const { success } = await subscribeEmail(email);
    if (success) { setSubscribed(true); setEmail(""); }
    setSubLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ---------------------------------------------------
          HERO — Cinematic dark viewport
      --------------------------------------------------- */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gradient-hero"
      >
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />

        {/* Geometric teal glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full
          bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        {/* Floating geometric shapes */}
        <motion.div className="absolute top-24 left-[8%] w-2 h-2 rounded-full bg-primary/40"
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
        <motion.div className="absolute top-1/3 right-[12%] w-1.5 h-1.5 rounded-full bg-accent/50"
          animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }} />
        <motion.div className="absolute bottom-1/3 left-[20%] w-1 h-1 rounded-full bg-primary/30"
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30
              bg-primary/10 text-primary-400 text-sm font-medium mb-8">
              <LogoIcon size={16} />
              The Somali Knowledge Network
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-heading font-extrabold leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-foreground">Aqoonta</span>
            <br />
            <span className="text-gradient">Umadda Soomaaliyeed</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Ask, share, and discover knowledge with the global Somali community.
            Every question answered, every insight shared.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="min-w-44">
                Start Learning
              </Button>
            </Link>
            <Link href="/questions">
              <Button variant="outline" size="lg" className="min-w-44">
                Browse Questions
              </Button>
            </Link>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-12 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { label: "Questions answered", value: 12400, suffix: "+" },
              { label: "Active members",     value: 8200,  suffix: "+" },
              { label: "Topics covered",     value: 24,    suffix: ""  },
              { label: "Countries reached",  value: 31,    suffix: ""  },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-gradient font-heading">
                  <Counter to={value} suffix={suffix} />
                </div>
                <div className="text-xs text-foreground-subtle mt-1 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24
          bg-gradient-to-t from-background to-transparent pointer-events-none" />
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
              All topics ?
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(Array.isArray(categories) ? categories : []).slice(0, 8).map((cat, i) => {
            const name = typeof cat === "string" ? cat : (cat as { name: string }).name;
            return (
              <motion.div key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Link href={`/topics?category=${encodeURIComponent(name)}`}>
                  <div className="group glass-card rounded-2xl p-4 hover:border-primary/30 hover:-translate-y-1
                    transition-all duration-200 cursor-pointer text-center">
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
              <motion.div key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}>
                <Link href={`/questions/${post.id}`}>
                  <div className="group glass-card rounded-2xl p-5 hover:border-primary/25 hover:-translate-y-1
                    transition-all duration-200 cursor-pointer h-full flex flex-col">
                    <span className="inline-flex px-2.5 py-0.5 rounded-md bg-primary/10 text-primary-400
                      text-[10px] font-bold uppercase tracking-wide mb-3 w-fit">
                      {post.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary-400
                      transition-colors line-clamp-2 leading-snug mb-3 flex-1">
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
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px]
            rounded-full bg-primary/8 blur-[100px]" />
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
              Join the Somali<br />
              <span className="text-gradient">Knowledge Movement</span>
            </h2>
            <p className="text-foreground-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Be part of a growing community of thinkers, learners, and creators
              building the digital knowledge hub of the Somali world.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/15 border border-primary/30 text-primary-400 font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    onChange={e => setEmail(e.target.value)}
                    placeholder="or enter your email..."
                    required
                    className="px-4 py-2.5 text-sm rounded-xl bg-surface-elevated border border-border
                      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                      placeholder-foreground-subtle w-56"
                  />
                  <Button type="submit" variant="secondary" size="md" isLoading={subLoading}>
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
