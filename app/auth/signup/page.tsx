/**
 * Sign Up Page
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
import FloatingShapes from "@/components/layout/FloatingShapes";
import { signUp } from "@/services/auth.service";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Using auth service - when migrating to Django, only service layer changes
    const { user, error: authError } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
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

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <FloatingShapes />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full bg-surface-elevated rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Ku Biir MIDEEYE
          </h2>
          <p className="text-foreground-muted">
            Samee akoon cusub si aad ugu biirto bulshada
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger-muted/40 border border-danger-border rounded-lg text-danger-foreground text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Magaca Buuxa"
            type="text"
            placeholder="Magacaaga geli"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <Input
            label="Erayga Sirta ah"
            type="password"
            placeholder="Ugu yaraan 6 xaraf"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            minLength={6}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loading}
          >
            Samee Akoon
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-foreground-muted">
            Ma haysataa akoon horey?{" "}
          </span>
          <Link
            href="/auth/login"
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Halkan ka gal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
