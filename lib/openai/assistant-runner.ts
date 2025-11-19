/**
 * OpenAI Assistant Runner
 *
 * Executes assistants with streaming support
 * Handles the run lifecycle and event streaming
 *
 * IMPORTANT: This file is SERVER-ONLY
 */

import "server-only";

import { getOpenAIClient, getAssistantIdForTier } from "./client";
import type { UserTier } from "@/types/subscription";
import { TOKEN_LIMITS } from "@/lib/constants/limits";

/**
 * Run assistant on a thread with streaming
 *
 * This creates a run and streams the assistant's response in real-time
 *
 * @param threadId - OpenAI thread ID
 * @param tier - User's subscription tier (determines which assistant to use)
 * @param additionalInstructions - Optional context injection (e.g., user context for paid users)
 * @returns Async iterable stream of events
 */
export async function runAssistantStream(
  threadId: string,
  tier: UserTier,
  additionalInstructions?: string,
) {
  try {
    const openai = getOpenAIClient();
    const assistantId = getAssistantIdForTier(tier);

    console.log(
      `[Assistant Runner] Starting run on thread ${threadId} with assistant ${assistantId} (tier: ${tier})`,
    );

    // Create and stream the run
    const stream = await openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
      additional_instructions: additionalInstructions,
      max_completion_tokens: TOKEN_LIMITS.ASSISTANT_RESPONSE_MAX,
    });

    return stream;
  } catch (error) {
    console.error("[Assistant Runner] Error running assistant:", error);
    throw new Error("Failed to run assistant");
  }
}

/**
 * Run assistant without streaming (for simple use cases)
 *
 * Use this if you don't need real-time streaming and can wait for full response
 *
 * @param threadId - OpenAI thread ID
 * @param tier - User's subscription tier
 * @param additionalInstructions - Optional context injection
 * @returns Run object with status
 */
export async function runAssistant(
  threadId: string,
  tier: UserTier,
  additionalInstructions?: string,
) {
  try {
    const openai = getOpenAIClient();
    const assistantId = getAssistantIdForTier(tier);

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      additional_instructions: additionalInstructions,
      max_completion_tokens: TOKEN_LIMITS.ASSISTANT_RESPONSE_MAX,
    });

    console.log(
      `[Assistant Runner] Created run ${run.id} on thread ${threadId}`,
    );

    return run;
  } catch (error) {
    console.error("[Assistant Runner] Error creating run:", error);
    throw new Error("Failed to create assistant run");
  }
}

/**
 * Poll for run completion (for non-streaming runs)
 *
 * @param threadId - OpenAI thread ID
 * @param runId - Run ID to poll
 * @param maxAttempts - Maximum polling attempts (default: 30)
 * @returns Completed run object
 */
export async function pollRunCompletion(
  threadId: string,
  runId: string,
  maxAttempts: number = 30,
) {
  const openai = getOpenAIClient();
  let attempts = 0;

  while (attempts < maxAttempts) {
    const run = await openai.beta.threads.runs.retrieve(runId, {
      thread_id: threadId,
    });

    if (run.status === "completed") {
      console.log(`[Assistant Runner] Run ${runId} completed`);
      return run;
    }

    if (
      run.status === "failed" ||
      run.status === "cancelled" ||
      run.status === "expired"
    ) {
      console.error(
        `[Assistant Runner] Run ${runId} failed with status: ${run.status}`,
      );
      throw new Error(`Run failed with status: ${run.status}`);
    }

    // Wait 1 second before next poll
    await new Promise((resolve) => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error("Run polling timed out");
}
