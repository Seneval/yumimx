/**
 * useMessageLimits Hook - Get message limits for a specific dream
 *
 * This hook fetches and calculates message limits for free users.
 * It counts user messages for the dream and returns remaining messages.
 *
 * Safe to use in client components - respects RLS.
 */

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserTier, MessageLimitInfo } from "@/types/subscription";
import { MESSAGE_LIMITS } from "@/types/subscription";

interface UseMessageLimitsReturn {
  limits: MessageLimitInfo | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMessageLimits(
  dreamId: string | null,
): UseMessageLimitsReturn {
  const [limits, setLimits] = useState<MessageLimitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLimits = async () => {
    if (!dreamId) {
      setLimits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get user tier
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("tier")
        .eq("id", user.id)
        .single();

      const tier = (profile?.tier as UserTier) || "free";

      // Count user messages for this dream
      const { count, error: countError } = await supabase
        .from("dream_messages")
        .select("*", { count: "exact", head: true })
        .eq("dream_id", dreamId)
        .eq("user_id", user.id)
        .eq("role", "user");

      if (countError) throw countError;

      const messagesUsed = count || 0;
      const limit = MESSAGE_LIMITS[tier];

      // Paid users have unlimited messages
      if (tier === "paid") {
        setLimits({
          tier,
          messagesUsed,
          messagesLimit: null,
          canSendMessage: true,
          remainingMessages: null,
        });
      } else {
        // Free users have limits
        const canSendMessage = messagesUsed < (limit || 0);
        const remainingMessages = Math.max(0, (limit || 0) - messagesUsed);

        setLimits({
          tier,
          messagesUsed,
          messagesLimit: limit,
          canSendMessage,
          remainingMessages,
        });
      }
    } catch (err) {
      console.error("[useMessageLimits] Error fetching limits:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, [dreamId]);

  return {
    limits,
    loading,
    error,
    refetch: fetchLimits,
  };
}
