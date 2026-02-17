/**
 * NotificationBell Component
 * Real-time notification dropdown with badge counter
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/utils/helpers";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      refresh();
    }
  }, [isOpen, refresh]);

  const handleNotificationClick = async (
    notificationId: string,
    link: string,
    isRead: boolean
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
    setIsOpen(false);
    router.push(link);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-lg hover:bg-surface-muted transition-colors"
      >
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-accent-red text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-surface-muted">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:text-primary-600 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <svg
                    className="animate-spin h-8 w-8 mx-auto text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-foreground-secondary mt-2">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-foreground-tertiary opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-foreground-secondary mt-4">
                    No notifications yet
                  </p>
                  <p className="text-foreground-tertiary text-sm mt-1">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.link || "/dashboard",
                        notification.is_read
                      )
                    }
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-border bg-surface-muted">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/notifications");
                  }}
                  className="w-full text-center text-sm text-primary hover:text-primary-600 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * NotificationItem Component
 * Individual notification row
 */
interface NotificationItemProps {
  notification: any;
  onClick: () => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const icon = getNotificationIcon(notification.type);
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(var(--color-surface-muted-rgb), 0.5)" }}
      className={cn(
        "w-full px-4 py-3 flex items-start gap-3 border-b border-border/50 text-left transition-colors",
        !notification.is_read && "bg-primary/5"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg",
          !notification.is_read
            ? "bg-primary/20 text-primary"
            : "bg-surface-muted text-foreground-secondary"
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-relaxed",
            notification.is_read
              ? "text-foreground-secondary"
              : "text-foreground font-medium"
          )}
        >
          {notification.message}
        </p>
        <p className="text-xs text-foreground-tertiary mt-1">{timeAgo}</p>
      </div>

      {/* Unread Indicator */}
      {!notification.is_read && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
      )}
    </motion.button>
  );
}

/**
 * Get emoji/icon for notification type
 */
function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    post_upvote: "👍",
    post_comment: "💬",
    comment_reply: "↩️",
    mention: "📣",
    new_follower: "👤",
    answer_upvote: "⭐",
    answer_comment: "💭",
    badge_earned: "🏆",
    milestone: "🎉",
  };

  return icons[type] || "🔔";
}
