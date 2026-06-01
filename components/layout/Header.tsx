/**
 * MIDEEYE HEADER — XIDDIG DESIGN SYSTEM
 * Premium frosted glass navigation.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth.service";
import { MideeyeLogo } from "@/components/brand/MideeyeLogo";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { useProfile } from "@/hooks/useProfile";
import NotificationBell from "@/components/ui/NotificationBell";

const NAV_LINKS = [
  { href: "/questions", label: "Questions" },
  { href: "/topics",    label: "Topics"    },
  { href: "/users",     label: "People"    },
];

export default function Header() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const homeHref = user ? "/dashboard" : "/";

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await logout();
    setProfileOpen(false);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/questions?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 safe-area-inset-top glass-nav border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-3">

          {/* Logo */}
          <Link href={homeHref} className="shrink-0">
            <MideeyeLogo size="sm" variant="dark" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 ml-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive(href)
                    ? "bg-primary/10 text-primary-400"
                    : "text-foreground-muted hover:text-foreground hover:bg-surface-muted"
                }`}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={searchRef}
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search knowledge..."
                    className="w-64 pl-9 pr-4 py-2 text-sm bg-surface-elevated border border-border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                      placeholder-foreground-subtle transition-all"
                  />
                </div>
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="p-1.5 text-foreground-subtle hover:text-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-subtle
                  bg-surface-elevated/60 border border-border rounded-xl
                  hover:bg-surface-muted hover:text-foreground transition-all w-48">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search...</span>
                <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-surface-muted font-mono opacity-60">?K</kbd>
              </button>
            )}
          </div>

          {/* Mobile Search */}
          <button className="md:hidden p-2 text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface-muted transition-colors"
            onClick={() => setSearchOpen(!searchOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Ask CTA (Desktop) */}
          {user && (
            <Link href="/ask" className="hidden md:inline-flex">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                bg-primary text-primary-fg hover:bg-primary-400 transition-all duration-150 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Ask
              </span>
            </Link>
          )}

          {/* Notifications */}
          {user && <NotificationBell />}

          {/* Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center rounded-full ring-2 ring-transparent hover:ring-primary/40 transition-all">
                <Avatar src={profile?.avatarUrl || undefined} alt={profile?.fullName || "User"} size="sm" className="w-8 h-8" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border rounded-2xl shadow-float overflow-hidden z-50 animate-scale-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{profile?.fullName || "User"}</p>
                    <p className="text-xs text-foreground-subtle truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { href: "/profile",   label: "My Profile" },
                      { href: "/dashboard", label: "Dashboard"  },
                      { href: "/settings",  label: "Settings"   },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href} onClick={() => setProfileOpen(false)}>
                        <span className="flex items-center px-4 py-2.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors cursor-pointer">
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border py-1">
                    <button onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-danger hover:bg-surface-muted transition-colors">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login">
                <span className="inline-flex px-3.5 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-muted rounded-lg transition-colors cursor-pointer">
                  Log in
                </span>
              </Link>
              <Link href="/auth/signup">
                <span className="inline-flex px-4 py-1.5 text-sm font-semibold bg-primary text-primary-fg hover:bg-primary-400 rounded-xl transition-all cursor-pointer">
                  Sign up
                </span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Search Expansion */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search MIDEEYE..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-elevated border border-border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                  placeholder-foreground-subtle"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-lg">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                <span className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive(href) ? "bg-primary/10 text-primary-400" : "text-foreground-muted hover:text-foreground hover:bg-surface-muted"
                }`}>
                  {label}
                </span>
              </Link>
            ))}
            {user ? (
              <Link href="/ask" onClick={() => setMobileMenuOpen(false)}>
                <span className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-400 hover:bg-primary/10 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Ask a Question
                </span>
              </Link>
            ) : (
              <div className="flex gap-2 px-1 pt-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <span className="flex justify-center px-3 py-2 rounded-xl text-sm font-medium border border-border text-foreground-muted hover:bg-surface-muted transition-colors cursor-pointer">
                    Log in
                  </span>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <span className="flex justify-center px-3 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-fg transition-colors cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
