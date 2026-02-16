/**
 * HORUMARIN HOMEPAGE - CINEMATIC TRANSFORMATION
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
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";
import Skeleton from "@/components/ui/Skeleton";
import Alert from "@/components/ui/Alert";
import { HorumarinLogo, LogoIcon } from "@/components/brand/HorumarinLogo";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import LiveActivityFeed from "@/components/ui/LiveActivityFeed";
import { subscribeEmail } from "@/services/email.service";
import { categories } from "@/utils/constants";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveUsers, setLiveUsers] = useState(847);
  const [showAlert, setShowAlert] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);

  // Simulate live user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
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
      {/* HERO - PROFESSIONAL & CONTENT-FOCUSED */}
      {/* ================================================ */}
      <section className="dark relative bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Bulshada Aqoonta
          </h1>

          {/* Subheading */}
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-10">
            Ka qayb qaado bulshada Soomaaliyeed ee ugu weyn ee aqoonta wadaagta, 
            su'aalo weydiiso, oo jawaabo ka hel dadka khibradda leh.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="min-w-[180px]">
                Bilow Hadda
              </Button>
            </Link>
            <Link href="/questions">
              <Button size="lg" variant="outline" className="min-w-[180px]">
                Daawasho Su'aalaha
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wave divider - smooth transition */}
      <div className="relative h-24 bg-gradient-to-b from-slate-800 dark:from-slate-900 to-background">
        <svg
          className="absolute bottom-0 w-full h-24"
          preserveAspectRatio="none"
          viewBox="0 0 1440 48"
          fill="none"
        >
          <path
            d="M0 48H1440V24C1440 24 1080 0 720 0C360 0 0 24 0 24V48Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* ================================================ */}
      {/* GLASS-MORPHISM CATEGORY CARDS */}
      {/* ================================================ */}
      <section className="py-20 px-4 bg-surface relative">
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
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Qaybaha Aqooneed
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
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
                  <div className="group relative overflow-hidden p-8 h-full cursor-pointer bg-surface border border-border hover:border-primary-400 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md">
                    {/* Subtle gradient background on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(59, 130, 246, 0.05) 100%)`,
                      }}
                    />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-5xl mb-6 transform group-hover:scale-105 transition-transform duration-300">
                        {category.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary-700 transition-colors">
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
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Sida Ay U Shaqeyso
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
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
                <Card hover className="p-6 h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
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
      <section className="py-16 px-4 bg-surface-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-display font-bold mb-2 text-foreground">
                Su'aalaha Ugu Firfircoon
              </h2>
              <p className="text-foreground-muted">
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
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left side - Live Activity */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-foreground">
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
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Xubnaha Firfircoon Maanta
                </h3>
                <p className="text-foreground-muted text-sm">
                  Dadka ka caawiya horumarinta bulshada
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
      <section className="py-16 px-4 bg-surface-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-display font-bold mb-3 text-foreground">
              Qaybaha Aqoon
            </h2>
            <p className="text-lg text-foreground-muted">
              Dooro qaybta ku habboon oo hel dadka khibradda leh
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    className={`p-5 bg-gradient-to-br ${category.gradient} text-primary-fg cursor-pointer group`}
                  >
                    <div className="text-3xl mb-3">{category.icon}</div>
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
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-display font-bold mb-3 text-foreground">
              Xubnaha Firfircoon
            </h2>
            <p className="text-lg text-foreground-muted">
              Dadka ka caawiya horumarinta bulshada
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-hero p-10 md:p-12 text-primary-foreground shadow-elevated"
          >
            {/* Decorative orb */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-surface/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Hel Ogeysiisyada Cusub
              </h2>
              <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
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
                    className="whitespace-nowrap shadow-button"
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
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Diyaar Ma U Tahay Inaad{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Bilaabto?
              </span>
            </h2>
            <p className="text-xl text-foreground-muted mb-8 leading-relaxed">
              Ku biir kumanaanka xubnood ee horumarinaya aqoonta bulshada
              Soomaaliyeed. Bilow maanta - waa bilaash!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="min-w-[200px] shadow-button">
                  Samee Akoon Bilaash
                </Button>
              </Link>
              <Link href="/questions">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Daawasho Kaliya
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-foreground-muted mb-4">
                La kalsoonaan tahay kumanaanka xubnood
              </p>
              <div className="flex justify-center items-center gap-8 opacity-50">
                <div className="flex -space-x-2">
                  {["🧑‍💻", "👩‍🏫", "👨‍💼", "👩‍🔬", "🧑‍🎓"].map((avatar, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center text-xl"
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
