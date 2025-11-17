/**
 * OpenAI Threads Management
 *
 * Handles creation and management of conversation threads
 * for OpenAI Assistants API
 *
 * IMPORTANT: This file is SERVER-ONLY
 */

import "server-only";

import { getOpenAIClient } from "./client";

/**
 * Create a new thread for a dream conversation
 *
 * Each dream gets its own thread to maintain conversation context
 *
 * @returns Thread ID to be stored in database
 */
export async function createThread(): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const thread = await openai.beta.threads.create();

    console.log("[OpenAI Threads] Created new thread:", thread.id);

    return thread.id;
  } catch (error) {
    console.error("[OpenAI Threads] Error creating thread:", error);
    throw new Error("Failed to create conversation thread");
  }
}

/**
 * Add a message to an existing thread
 *
 * @param threadId - OpenAI thread ID
 * @param content - Message content
 * @param role - Message role (user or assistant)
 */
export async function addMessageToThread(
  threadId: string,
  content: string,
  role: "user" | "assistant" = "user",
): Promise<void> {
  try {
    const openai = getOpenAIClient();

    await openai.beta.threads.messages.create(threadId, {
      role,
      content,
    });

    console.log(`[OpenAI Threads] Added ${role} message to thread ${threadId}`);
  } catch (error) {
    console.error("[OpenAI Threads] Error adding message:", error);
    throw new Error("Failed to add message to thread");
  }
}

/**
 * Retrieve all messages from a thread
 *
 * Useful for displaying conversation history or debugging
 *
 * @param threadId - OpenAI thread ID
 * @returns Array of messages
 */
export async function getThreadMessages(threadId: string) {
  try {
    const openai = getOpenAIClient();
    const messages = await openai.beta.threads.messages.list(threadId);

    return messages.data;
  } catch (error) {
    console.error("[OpenAI Threads] Error retrieving messages:", error);
    throw new Error("Failed to retrieve thread messages");
  }
}

/**
 * Delete a thread (cleanup)
 *
 * Optional: Use this if you want to delete threads when dreams are deleted
 *
 * @param threadId - OpenAI thread ID
 */
export async function deleteThread(threadId: string): Promise<void> {
  try {
    const openai = getOpenAIClient();
    await openai.beta.threads.delete(threadId);

    console.log("[OpenAI Threads] Deleted thread:", threadId);
  } catch (error) {
    console.error("[OpenAI Threads] Error deleting thread:", error);
    // Don't throw - deletion failures are not critical
  }
}
