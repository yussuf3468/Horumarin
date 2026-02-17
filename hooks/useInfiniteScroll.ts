/**
 * useInfiniteScroll Hook - Cursor-based pagination
 *
 * Provides efficient infinite scrolling without offset pagination
 * Supports intersection observer for automatic loading
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollProps<T> {
  fetchFunction: (
    cursor: string | null,
    limit: number,
  ) => Promise<{
    data: T[];
    nextCursor: string | null;
    error: string | null;
  }>;
  limit?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  observerRef: (node: Element | null) => void;
}

export function useInfiniteScroll<T>({
  fetchFunction,
  limit = 20,
  enabled = true,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const isInitialMount = useRef(true);

  // Observer callback for last element
  const observerRef = useCallback(
    (node: Element | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingMore, hasMore],
  );

  // Initial load
  const loadInitial = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(null, limit);

      if (result.error) {
        setError(result.error);
        setData([]);
        setHasMore(false);
        return;
      }

      setData(result.data);
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor && result.data.length === limit);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      setData([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, limit, enabled]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const result = await fetchFunction(cursor, limit);

      if (result.error) {
        setError(result.error);
        setHasMore(false);
        return;
      }

      setData((prev) => [...prev, ...result.data]);
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor && result.data.length === limit);
    } catch (err: any) {
      setError(err.message || "Failed to load more data");
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, hasMore, isLoadingMore, isLoading, fetchFunction, limit]);

  // Refresh data
  const refresh = useCallback(async () => {
    setCursor(null);
    setHasMore(true);
    await loadInitial();
  }, [loadInitial]);

  // Initial load on mount
  useEffect(() => {
    if (isInitialMount.current && enabled) {
      isInitialMount.current = false;
      loadInitial();
    }
  }, [enabled, loadInitial]);

  return {
    data,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    observerRef,
  };
}

/**
 * Example usage:
 *
 * const { data, isLoading, hasMore, loadMore, observerRef } = useInfiniteScroll({
 *   fetchFunction: async (cursor, limit) => {
 *     const { data, nextCursor, error } = await getQuestions({ cursor, limit });
 *     return { data, nextCursor, error };
 *   },
 *   limit: 20,
 * });
 *
 * return (
 *   <div>
 *     {data.map((item, index) => (
 *       <div
 *         key={item.id}
 *         ref={index === data.length - 1 ? observerRef : null}
 *       >
 *         {item.content}
 *       </div>
 *     ))}
 *     {isLoadingMore && <LoadingSpinner />}
 *   </div>
 * );
 */
