/**
 * Server-side Environment Variables Validation with Zod
 *
 * ⚠️ SERVER-ONLY - This file MUST NOT be imported from client components
 *
 * This file validates all environment variables (both public and server-only).
 * If any required variable is missing or invalid, the app will FAIL FAST.
 *
 * SECURITY RULES:
 * - Variables with NEXT_PUBLIC_ prefix are exposed to the client (browser)
 * - Variables without prefix are SERVER-ONLY
 * - NEVER use NEXT_PUBLIC_ for sensitive data (API keys, secrets, etc.)
 *
 * For client-side usage, use '@/lib/env-client' instead.
 *
 * @see SECURITY-RULES.md for complete security guidelines
 */

import "server-only";
import { z } from "zod";

// ============================================
// Environment Schema Definition
// ============================================

const envSchema = z.object({
  // ==========================================
  // Supabase Configuration
  // ==========================================

  /**
   * Supabase Project URL
   * PUBLIC - Safe to expose to client
   * Example: https://xyzcompany.supabase.co
   */
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .startsWith("https://", "NEXT_PUBLIC_SUPABASE_URL must use HTTPS"),

  /**
   * Supabase Anonymous Key
   * PUBLIC - Safe to expose to client (RLS policies protect data)
   * This key respects Row Level Security policies
   */
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  /**
   * Supabase Service Role Key
   * PRIVATE - SERVER-ONLY - NEVER expose to client
   * This key BYPASSES Row Level Security - use with extreme caution
   */
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // ==========================================
  // OpenAI API Configuration
  // ==========================================

  /**
   * OpenAI API Key
   * PRIVATE - SERVER-ONLY - NEVER expose to client
   * Must start with "sk-" or "sk-proj-"
   */
  OPENAI_API_KEY: z
    .string()
    .min(1, "OPENAI_API_KEY is required")
    .refine(
      (key) => key.startsWith("sk-") || key.startsWith("sk-proj-"),
      'OPENAI_API_KEY must start with "sk-" or "sk-proj-"',
    ),

  /**
   * OpenAI Assistant ID for FREE tier users
   * PRIVATE - SERVER-ONLY - NEVER expose to client
   * Must start with "asst_"
   */
  OPENAI_ASSISTANT_ID_FREE: z
    .string()
    .min(1, "OPENAI_ASSISTANT_ID_FREE is required")
    .startsWith("asst_", 'OPENAI_ASSISTANT_ID_FREE must start with "asst_"'),

  /**
   * OpenAI Assistant ID for PAID tier users
   * PRIVATE - SERVER-ONLY - NEVER expose to client
   * Must start with "asst_"
   */
  OPENAI_ASSISTANT_ID_PAID: z
    .string()
    .min(1, "OPENAI_ASSISTANT_ID_PAID is required")
    .startsWith("asst_", 'OPENAI_ASSISTANT_ID_PAID must start with "asst_"'),

  // ==========================================
  // Application Configuration
  // ==========================================

  /**
   * Public URL of the application
   * PUBLIC - Safe to expose
   * Development: http://localhost:3000
   * Production: https://your-domain.com
   */
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),

  /**
   * Node Environment
   * Defaults to 'development' if not specified
   */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // ==========================================
  // Future: Payment Processing (Optional)
  // ==========================================

  /**
   * Stripe Secret Key (when implemented)
   * PRIVATE - SERVER-ONLY
   */
  STRIPE_SECRET_KEY: z
    .string()
    .startsWith("sk_", 'STRIPE_SECRET_KEY must start with "sk_"')
    .optional(),

  /**
   * Stripe Webhook Secret (when implemented)
   * PRIVATE - SERVER-ONLY
   */
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith("whsec_", 'STRIPE_WEBHOOK_SECRET must start with "whsec_"')
    .optional(),

  /**
   * Stripe Publishable Key (when implemented)
   * PUBLIC - Safe to expose
   */
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith(
      "pk_",
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"',
    )
    .optional(),
});

// ============================================
// Type Inference
// ============================================

/**
 * TypeScript type derived from the Zod schema
 * Use this for type-safe access to environment variables
 */
export type Env = z.infer<typeof envSchema>;

// ============================================
// Validation & Parsing
// ============================================

/**
 * Parse and validate environment variables
 * This runs at module load time (startup)
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables detected:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  console.error(
    "\n📝 Please check your .env.local file and ensure all required variables are set correctly.",
  );
  console.error("📚 See .env.example for reference.");
  throw new Error("Invalid environment variables - check logs above");
}

// ============================================
// Validated Environment Variables Export
// ============================================

/**
 * Validated and type-safe environment variables
 *
 * Usage:
 * ```typescript
 * import { env } from '@/lib/env';
 *
 * // TypeScript will autocomplete and type-check!
 * const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
 * const openaiKey = env.OPENAI_API_KEY;
 * ```
 */
export const env = parsed.data;

// ============================================
// Runtime Checks (Additional Security)
// ============================================

/**
 * Verify that NEXT_PUBLIC_ variables are truly public
 * and private variables don't have NEXT_PUBLIC_ prefix
 */
if (typeof window !== "undefined") {
  // Running in browser - verify no server-only variables leaked
  const serverOnlyVars = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
    "OPENAI_ASSISTANT_ID_FREE",
    "OPENAI_ASSISTANT_ID_PAID",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ] as const;

  serverOnlyVars.forEach((varName) => {
    if (varName in env && env[varName as keyof Env]) {
      console.error(
        `🚨 SECURITY ALERT: Server-only variable ${varName} is exposed to the client!`,
      );
      console.error("This should NEVER happen. Check your build process.");
      // In development, we throw. In production, we might want to just log
      if (env.NODE_ENV === "development") {
        throw new Error(`Security breach: ${varName} exposed to client`);
      }
    }
  });
}

// ============================================
// TypeScript Global Augmentation
// ============================================

/**
 * Extend the global ProcessEnv interface
 * This provides autocomplete in process.env throughout the codebase
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
