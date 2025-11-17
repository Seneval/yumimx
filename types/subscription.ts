/**
 * Types for subscription/tier system
 *
 * Defines all tier-related types used across the application.
 */

import type { Database } from "./database";

// Extract tier type from database
export type UserTier =
  Database["public"]["Tables"]["user_profiles"]["Row"]["tier"];

// User tier information
export interface UserTierInfo {
  userId: string;
  tier: UserTier;
  tierUpgradedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Message limit information for a specific dream
export interface MessageLimitInfo {
  tier: UserTier;
  messagesUsed: number;
  messagesLimit: number | null; // null = unlimited (paid users)
  canSendMessage: boolean;
  remainingMessages: number | null; // null = unlimited
}

// Protected features that require paid tier
export type ProtectedFeature = "journal" | "context" | "unlimited_messages";

// Message limits configuration
export const MESSAGE_LIMITS: Record<UserTier, number | null> = {
  free: 3, // 3 follow-up messages per dream
  paid: null, // unlimited
} as const;
