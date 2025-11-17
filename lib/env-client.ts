/**
 * Client-side Environment Variables
 *
 * This file validates ONLY public environment variables (NEXT_PUBLIC_*).
 * These variables are safe to expose to the browser.
 *
 * IMPORTANT: This file can be imported from client components.
 */

import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .startsWith("https://"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

// IMPORTANTE: En el navegador, Next.js reemplaza variables NEXT_PUBLIC_* en build-time
// Solo funcionan accesos DIRECTOS a propiedades (no process.env como objeto)
const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid public environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  console.error("Full error:", parsed.error);
  throw new Error("Invalid public environment variables");
}

export const clientEnv = parsed.data;
