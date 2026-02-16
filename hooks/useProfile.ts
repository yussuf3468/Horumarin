/**
 * useProfile Hook
 *
 * This hook uses the user service layer instead of calling Supabase directly.
 * When migrating to Django, no changes are needed here - only in user.service.ts
 */

"use client";

import { useEffect, useState } from "react";
import { getUserProfile, type UserProfile } from "@/services/user.service";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      const userProfile = await getUserProfile(userId!);
      setProfile(userProfile);
      setLoading(false);
    }

    fetchProfile();
  }, [userId, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { profile, loading, refetch };
}
