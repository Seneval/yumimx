/**
 * Tier Service - Server-side tier checking and validation
 *
 * IMPORTANT: This file contains server-only logic.
 * Never import this from client components.
 */

import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  UserTier,
  MessageLimitInfo,
  ProtectedFeature,
} from "@/types/subscription";
import { MESSAGE_LIMITS } from "@/types/subscription";

export class TierService {
  /**
   * Get user's current tier from database
   *
   * @param userId - UUID of the user
   * @returns UserTier ('free' or 'paid')
   * @throws Never - returns 'free' on error as safe default
   */
  static async getUserTier(userId: string): Promise<UserTier> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("user_profiles")
        .select("tier")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("[TierService] Error fetching user tier:", error);
        return "free"; // Safe default
      }

      if (!data) {
        console.warn("[TierService] User profile not found:", userId);
        return "free"; // Safe default
      }

      return data.tier;
    } catch (error) {
      console.error("[TierService] Unexpected error in getUserTier:", error);
      return "free"; // Safe default
    }
  }

  /**
   * Count how many messages a user has sent for a specific dream
   *
   * @param userId - UUID of the user
   * @param dreamId - UUID of the dream
   * @returns Number of user messages (role='user')
   */
  static async getUserMessageCount(
    userId: string,
    dreamId: string,
  ): Promise<number> {
    try {
      const supabase = await createClient();

      const { count, error } = await supabase
        .from("dream_messages")
        .select("*", { count: "exact", head: true })
        .eq("dream_id", dreamId)
        .eq("user_id", userId)
        .eq("role", "user");

      if (error) {
        console.error("[TierService] Error counting messages:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error(
        "[TierService] Unexpected error in getUserMessageCount:",
        error,
      );
      return 0;
    }
  }

  /**
   * Check if a user can send a message for a specific dream
   *
   * Business rules:
   * - Free users: 3 follow-up messages per dream
   * - Paid users: unlimited messages
   * - Validation is ALWAYS server-side
   *
   * @param userId - UUID of the user
   * @param dreamId - UUID of the dream
   * @returns true if user can send message, false otherwise
   */
  static async canSendMessage(
    userId: string,
    dreamId: string,
  ): Promise<boolean> {
    const tier = await this.getUserTier(userId);

    // Paid users always can send
    if (tier === "paid") {
      return true;
    }

    // Free users have limits
    const messageCount = await this.getUserMessageCount(userId, dreamId);
    const limit = MESSAGE_LIMITS[tier];

    return limit === null || messageCount < limit;
  }

  /**
   * Get detailed message limit information for a dream
   *
   * @param userId - UUID of the user
   * @param dreamId - UUID of the dream
   * @returns MessageLimitInfo with usage stats
   */
  static async getMessageLimitInfo(
    userId: string,
    dreamId: string,
  ): Promise<MessageLimitInfo> {
    const tier = await this.getUserTier(userId);
    const messagesUsed = await this.getUserMessageCount(userId, dreamId);
    const limit = MESSAGE_LIMITS[tier];

    // Paid users have unlimited messages
    if (tier === "paid") {
      return {
        tier,
        messagesUsed,
        messagesLimit: null,
        canSendMessage: true,
        remainingMessages: null,
      };
    }

    // Free users have limits
    const canSendMessage = messagesUsed < (limit || 0);
    const remainingMessages = Math.max(0, (limit || 0) - messagesUsed);

    return {
      tier,
      messagesUsed,
      messagesLimit: limit,
      canSendMessage,
      remainingMessages,
    };
  }

  /**
   * Check if user has access to a protected feature
   *
   * Protected features require paid tier:
   * - journal: Dream journal with history
   * - context: Personal context for better interpretations
   * - unlimited_messages: Unlimited follow-up messages
   *
   * @param userId - UUID of the user
   * @param feature - Feature to check
   * @returns true if user has access, false otherwise
   */
  static async hasFeatureAccess(
    userId: string,
    feature: ProtectedFeature,
  ): Promise<boolean> {
    const tier = await this.getUserTier(userId);

    // Free users don't have access to protected features
    if (tier === "free") {
      return false;
    }

    // Paid users have access to all features
    return true;
  }

  /**
   * Check if dream belongs to user
   *
   * Security check to prevent users from accessing others' dreams
   *
   * @param userId - UUID of the user
   * @param dreamId - UUID of the dream
   * @returns true if dream belongs to user
   */
  static async isDreamOwner(userId: string, dreamId: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("dreams")
        .select("user_id")
        .eq("id", dreamId)
        .single();

      if (error || !data) {
        return false;
      }

      return data.user_id === userId;
    } catch (error) {
      console.error("[TierService] Error in isDreamOwner:", error);
      return false;
    }
  }
}
