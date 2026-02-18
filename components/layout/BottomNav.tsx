"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  getUnreadCount,
  subscribeToNotifications,
} from "@/services/notification.service";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch real notification count from database
      fetchNotificationCount();

      // Subscribe to real-time notification updates
      const unsubscribe = subscribeToNotifications(user.id, () => {
        fetchNotificationCount();
      });

      return unsubscribe;
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    if (!user) return;

    const { count } = await getUnreadCount(user.id);
    setNotificationCount(count);
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navItems = user
    ? [
        {
          href: "/dashboard",
          label: "Home",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
        },
        {
          href: "/questions",
          label: "Explore",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ),
        },
        {
          href: "/ask",
          label: "Ask",
          isCreate: true,
          icon: (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          ),
        },
        {
          href: "/chat",
          label: "Chat",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          ),
        },
        {
          href: "/notifications",
          label: "Inbox",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          ),
        },
      ]
    : [
        {
          href: "/",
          label: "Home",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
        },
        {
          href: "/questions",
          label: "Browse",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ),
        },
        {
          href: "/topics",
          label: "Topics",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          ),
        },
        {
          href: "/auth/login",
          label: "Login",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          ),
        },
      ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-xl border-t border-border/50 shadow-2xl safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 h-16">
          {navItems.map((item) => {
            const active = isActive(item.href);

            const content = (
              <>
                {item.isCreate ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/50 -mt-6 transition-all duration-300 active:scale-95">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-semibold text-primary">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 relative px-4 py-2 rounded-xl transition-all duration-200 active:scale-95">
                    {/* Icon container with background */}
                    <div
                      className={`relative transition-all duration-300 ${
                        active
                          ? "text-primary scale-110"
                          : "text-foreground-muted"
                      }`}
                    >
                      {item.icon}

                      {/* Notification Badge */}
                      {item.label === "Inbox" && notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-danger rounded-full flex items-center justify-center shadow-lg shadow-danger/50 animate-pulse">
                          <span className="text-[10px] font-bold text-white leading-none">
                            {notificationCount > 9 ? "9+" : notificationCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[10px] font-medium transition-all duration-200 ${
                        active
                          ? "text-primary font-semibold"
                          : "text-foreground-muted"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator dot */}
                    {active && (
                      <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                )}
              </>
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
