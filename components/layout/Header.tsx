/**
 * HORUMARIN HEADER - PROFESSIONAL DESIGN
 *
 * Clean, minimal navbar like Reddit/Stack Overflow
 * - Solid background, no blur effects
 * - Simple navigation
 * - Professional appearance
 *
 * Migration-safe: Uses auth.service abstraction
 */

"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth.service";
import Button from "@/components/ui/Button";
import { HorumarinLogo } from "@/components/brand/HorumarinLogo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <HorumarinLogo size="md" variant="light" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/questions">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground-muted hover:text-foreground hover:bg-surface-muted"
                  >
                    Su'aalaha
                  </Button>
                </Link>
                <Link href="/ask">
                  <Button size="sm" className="bg-primary hover:bg-primary-700">
                    Weydii
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground-muted hover:text-foreground hover:bg-surface-muted"
                  >
                    Profile
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border mx-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Kabax
                </Button>
              </>
            ) : (
              <>
                <Link href="/questions">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground-muted hover:text-foreground hover:bg-surface-muted"
                  >
                    Browse
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="border-border">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button (Placeholder for future) */}
          <button className="md:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors">
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
