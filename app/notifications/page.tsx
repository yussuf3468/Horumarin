"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { formatDate } from "@/utils/helpers";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotifications,
  type Notification,
} from "@/services/notification.service";
import { useToast } from "@/hooks/useToast";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      fetchNotifications();

      // Subscribe to real-time notifications
      const unsubscribe = subscribeToNotifications(user.id, () => {
        fetchNotifications();
      });

      return unsubscribe;
    }
  }, [user, authLoading, router]);

  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    const { notifications: data, error } = await getUserNotifications(user.id);

    if (error) {
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data);
    }

    setLoading(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "answer":
        return "💡";
      case "new_post":
        return "📝";
      case "follow":
        return "👥";
      case "mention":
        return "📢";
      default:
        return "🔔";
    }
  };

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.actor?.full_name || "Someone";

    switch (notification.type) {
      case "like":
        return `${actorName} wuu jeclaystay qoraalkaaga`;
      case "comment":
        return `${actorName} wuxuu faallooyay qoraalkaaga`;
      case "answer":
        return `${actorName} wuxuu ku jawaabay su'aashaada`;
      case "new_post":
        return `${actorName} wuxuu soo dhigay qoraal cusub`;
      case "follow":
        return `${actorName} ayaa ku raacay`;
      case "mention":
        return `${actorName} ayaa ku magacaabay`;
      default:
        return notification.message || "Ogeysiis cusub";
    }
  };

  const markAsRead = async (id: string) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );

    // Update in database
    const { error } = await markNotificationAsRead(id);
    if (error) {
      // Revert on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)),
      );
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    // Optimistically update UI
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    // Update in database
    const result = await markAllNotificationsAsRead();
    if (!result.success) {
      toast.error("Failed to mark all as read");
      fetchNotifications(); // Refetch on error
    } else {
      toast.success("All notifications marked as read");
    }
  };

  if (authLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Ogeysiisyada</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-foreground-muted mt-1">
                  Waxaad leedahay {unreadCount} ogeysiis oo cusub
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary-600 font-medium"
              >
                Dhameeysan oo dhan
              </button>
            )}
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/questions/${notification.entity_id}`}>
                  <Card
                    hover
                    className={`p-4 transition-all ${
                      !notification.is_read
                        ? "bg-primary/5 border-primary/20"
                        : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      {/* Actor Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar
                          src={notification.actor?.avatar_url || undefined}
                          alt={notification.actor?.full_name || "User"}
                          size="md"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <p className="text-sm font-medium text-foreground">
                                {getNotificationText(notification)}
                              </p>
                            </div>
                            <p className="text-xs text-foreground-muted mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-foreground-subtle mt-2">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>

                          {/* Unread Indicator */}
                          {!notification.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold mb-2">Ogeysiisyo ma jiraan</h3>
              <p className="text-foreground-muted">
                Ogeysiisyadaada oo dhan halkan ayay ka muuqan doonaan
              </p>
            </Card>
          )}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-6 bg-surface-muted border-border">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span>ℹ️</span>
              Warbixin
            </h3>
            <p className="text-sm text-foreground-muted">
              Waxaad halkan ka heli doontaa ogeysiisyada muhiimka ah sida:
            </p>
            <ul className="text-sm text-foreground-muted mt-2 space-y-1 ml-4">
              <li>• Markii qof uu jeclaado qoraalkaaga</li>
              <li>• Markii qof uu faalloodo ama jawaabo</li>
              <li>• Markii qoraal cusub la soo dhigo</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
