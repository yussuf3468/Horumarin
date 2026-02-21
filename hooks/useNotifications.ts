/**
 * useNotifications Hook
 * Real-time notification management with optimistic UI
 */

import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotifications,
  type Notification,
  type NotificationWithActor,
} from "@/services/notification.service";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationWithActor[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const result = await getNotifications({ limit: 50 });

    if (result.success && result.data) {
      setNotifications(result.data);
      setError(null);
    } else {
      setError(result.error || "Failed to load notifications");
    }

    setLoading(false);
  }, [user]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    const result = await getUnreadNotificationCount();
    if (result.success && result.data !== undefined) {
      setUnreadCount(result.data);
    }
  }, [user]);

  // Mark notification as read (optimistic)
  const markAsRead = useCallback(
    async (notificationId: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Server update
      const result = await markNotificationAsRead(notificationId);

      if (!result.success) {
        // Rollback on error
        fetchNotifications();
        fetchUnreadCount();
      }
    },
    [fetchNotifications, fetchUnreadCount],
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const previousNotifications = notifications;
    const previousCount = unreadCount;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        is_read: true,
        read_at: new Date().toISOString(),
      })),
    );
    setUnreadCount(0);

    // Server update
    const result = await markAllNotificationsAsRead();

    if (!result.success) {
      // Rollback on error
      setNotifications(previousNotifications);
      setUnreadCount(previousCount);
    }
  }, [notifications, unreadCount]);

  // Load on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(user.id, (notification) => {
      // Add new notification to list
      setNotifications((prev) => [notification, ...prev]);

      // Increment unread count
      if (!notification.is_read) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
