import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/lib/env-client";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para uso en el navegador (Client Components)
 *
 * - Usa cookies para mantener la sesión
 * - Respeta Row Level Security (RLS)
 * - Seguro para exponer al cliente (usa anon key)
 *
 * Uso:
 * ```tsx
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 *
 * const supabase = createClient();
 * const { data } = await supabase.from('dreams').select();
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
