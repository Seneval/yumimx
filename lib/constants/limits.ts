/**
 * Application-wide limits for content and tokens
 *
 * These constants centralize all length/token limits across the app
 * to make them easy to adjust and maintain consistency.
 */

/**
 * Character limits for dream descriptions and messages
 */
export const CHAR_LIMITS = {
  // Public demo (no authentication required)
  PUBLIC_DREAM_MIN: 50,
  PUBLIC_DREAM_MAX: 2000,

  // Free tier users
  FREE_MESSAGE_MAX: 2000,

  // Paid tier users
  PAID_MESSAGE_MAX: 10000,

  // User context (paid only)
  USER_CONTEXT_MAX: 15000,
} as const;

/**
 * Token limits for OpenAI API responses
 *
 * Note: 1 token ≈ 4 characters in Spanish
 * So 500 tokens ≈ 2,000 characters
 */
export const TOKEN_LIMITS = {
  // Maximum tokens for assistant response
  ASSISTANT_RESPONSE_MAX: 500, // ≈2,000 characters
} as const;

/**
 * Message limits per dream (tier-based)
 */
export const MESSAGE_LIMITS = {
  FREE_FOLLOW_UPS: 3, // Free users get 3 follow-up messages per dream
  // Paid users have unlimited follow-ups
} as const;

/**
 * Dream history context limits (paid tier only)
 */
export const CONTEXT_LIMITS = {
  // Number of past dreams to include in context
  DREAM_HISTORY_COUNT: 3,

  // Character limits for each dream in context
  DREAM_CONTENT_MAX: 1000,
  DREAM_INTERPRETATION_MAX: 300,
} as const;
