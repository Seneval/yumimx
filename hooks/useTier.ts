/**
 * useTier Hook - Get current user's tier
 *
 * This hook fetches the authenticated user's tier from the database.
 * Safe to use in client components - respects RLS.
 */

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserTier } from "@/types/subscription";

interface UseTierReturn {
  tier: UserTier;
  loading: boolean;
  error: Error | null;
  isPaid: boolean;
  isFree: boolean;
  refetch: () => Promise<void>;
}

export function useTier(): UseTierReturn {
  const [tier, setTier] = useState<UserTier>("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTier = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTier("free");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("user_profiles")
        .select("tier")
        .eq("id", user.id)
        .single();

      if (fetchError) throw fetchError;

      setTier((data?.tier as UserTier) || "free");
    } catch (err) {
      console.error("[useTier] Error fetching tier:", err);
      setError(err as Error);
      setTier("free"); // Safe default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTier();
  }, []);

  return {
    tier,
    loading,
    error,
    isPaid: tier === "paid",
    isFree: tier === "free",
    refetch: fetchTier,
  };
}
