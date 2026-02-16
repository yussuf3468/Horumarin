/**
 * useAuth Hook
 *
 * This hook uses the auth service layer instead of calling Supabase directly.
 * When migrating to Django, no changes are needed here - only in auth.service.ts
 */

"use client";

import { useEffect, useState } from "react";
import {
  getCurrentUser,
  onAuthStateChange,
  type AuthUser,
} from "@/services/auth.service";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
