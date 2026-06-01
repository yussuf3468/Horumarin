/**
 * Login Page
 *
 * Uses auth service layer for authentication.
 * No direct Supabase calls - ready for Django migration.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LogoIcon } from "@/components/brand/MideeyeLogo";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Using auth service - when migrating to Django, only service layer changes
    const { user, error: authError } = await login({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    if (user) {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const perks = [
    { icon: "💡", text: "Ask any question, get expert answers" },
    { icon: "🌍", text: "Connect with Somalis across 31 countries" },
    { icon: "📚", text: "Access a growing knowledge base" },
    { icon: "🤝", text: "Join 8,000+ active community members" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden
        bg-gradient-to-br from-surface via-background to-surface"
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-accent/8 blur-[80px]" />
        </div>

        {/* Floating dots */}
        {[
          ["top-16 right-16", "w-2 h-2", "bg-primary/40"],
          ["top-1/3 left-8", "w-1.5 h-1.5", "bg-accent/50"],
          ["bottom-1/4 right-24", "w-1 h-1", "bg-primary/30"],
        ].map(([pos, size, color], i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} ${size} rounded-full ${color}`}
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{
              repeat: Infinity,
              duration: 3 + i,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-16">
            <LogoIcon size={28} />
            <span className="text-lg font-bold text-foreground tracking-tight">
              MIDEEYE
            </span>
          </Link>

          <h1 className="text-4xl font-extrabold font-heading text-foreground leading-tight mb-4">
            Welcome back to
            <br />
            <span className="text-gradient">the Somali network</span>
          </h1>
          <p className="text-foreground-muted text-base leading-relaxed mb-12">
            The knowledge hub connecting Somalis around the world.
          </p>

          <div className="space-y-4">
            {perks.map(({ icon, text }) => (
              <motion.div
                key={text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-base">
                  {icon}
                </span>
                <span className="text-sm text-foreground-muted">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-foreground-subtle">
            &copy; {new Date().getFullYear()} MIDEEYE — Aqoonta Umadda
            Soomaaliyeed
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <LogoIcon size={24} />
            <span className="text-base font-bold text-foreground">MIDEEYE</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground font-heading mb-1.5">
              Sign in to your account
            </h2>
            <p className="text-sm text-foreground-muted">
              Don&apos;t have one?{" "}
              <Link
                href="/auth/signup"
                className="text-primary-400 hover:text-primary font-semibold transition-colors"
              >
                Create for free
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-4 bg-danger/10 border border-danger/25 rounded-xl text-sm text-danger">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <Link
              href="/"
              className="text-xs text-foreground-subtle hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
