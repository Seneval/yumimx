/**
 * OpenAI Client - Singleton instance
 *
 * IMPORTANT: This file is SERVER-ONLY
 * Never import this from client components
 */

import "server-only";

import OpenAI from "openai";
import { env } from "@/lib/env";
import type { UserTier } from "@/types/subscription";

// Singleton instance to avoid multiple client creations
let openaiClient: OpenAI | null = null;

/**
 * Get singleton OpenAI client instance
 *
 * @returns OpenAI client configured with API key
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Get appropriate assistant ID based on user tier
 *
 * Free users get basic assistant, paid users get advanced assistant
 *
 * @param tier - User's subscription tier
 * @returns OpenAI Assistant ID
 */
export function getAssistantIdForTier(tier: UserTier): string {
  return tier === "paid"
    ? env.OPENAI_ASSISTANT_ID_PAID
    : env.OPENAI_ASSISTANT_ID_FREE;
}
