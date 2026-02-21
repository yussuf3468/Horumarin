/**
 * useScrollRestoration Hook
 * Maintains scroll position when navigating back
 * Part of Immersive Flow UX system
 */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ScrollPosition {
  x: number;
  y: number;
}

// Global scroll position cache
const scrollCache = new Map<string, ScrollPosition>();

export function useScrollRestoration(key: string) {
  const router = useRouter();
  const restoredRef = useRef(false);

  useEffect(() => {
    // Restore scroll position on mount
    if (!restoredRef.current) {
      const savedPosition = scrollCache.get(key);
      if (savedPosition) {
        window.scrollTo(savedPosition.x, savedPosition.y);
        restoredRef.current = true;
      }
    }

    // Save scroll position before unmount
    return () => {
      scrollCache.set(key, {
        x: window.scrollX,
        y: window.scrollY,
      });
    };
  }, [key]);

  // Clear cache for a specific key
  const clearCache = () => {
    scrollCache.delete(key);
  };

  return { clearCache };
}

/**
 * useScrollMemory Hook
 * Remember scroll position between page transitions
 */
export function useScrollMemory() {
  const scrollPositions = useRef<Map<string, number>>(new Map());

  const saveScrollPosition = (key: string) => {
    scrollPositions.current.set(key, window.scrollY);
  };

  const restoreScrollPosition = (key: string) => {
    const position = scrollPositions.current.get(key);
    if (position !== undefined) {
      window.scrollTo(0, position);
    }
  };

  const clearScrollPosition = (key: string) => {
    scrollPositions.current.delete(key);
  };

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}

/**
 * useInfiniteScrollOptimized Hook
 * Performance-optimized infinite scroll with cursor-based pagination
 */
export function useInfiniteScrollOptimized<T>(
  fetchFn: (
    cursor?: string,
  ) => Promise<{ data: T[]; hasMore: boolean; nextCursor?: string }>,
  options?: {
    threshold?: number;
    initialLoad?: boolean;
  },
) {
  const { threshold = 300, initialLoad = true } = options || {};
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const loadingRef = React.useRef(false);

  const loadMore = React.useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const result = await fetchFn(cursor);
      setItems((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [cursor, hasMore, fetchFn]);

  // Intersection observer for scroll trigger
  const lastItemRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        {
          rootMargin: `${threshold}px`,
        },
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, loadMore, threshold],
  );

  // Initial load
  React.useEffect(() => {
    if (initialLoad && items.length === 0) {
      loadMore();
    }
  }, []);

  const refresh = React.useCallback(() => {
    setItems([]);
    setCursor(undefined);
    setHasMore(true);
    loadingRef.current = false;
  }, []);

  return {
    items,
    loading,
    hasMore,
    lastItemRef,
    loadMore,
    refresh,
  };
}

// Need React import for useState/useCallback
import React from "react";
