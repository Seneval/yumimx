import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para uso en Server Components y Server Actions
 *
 * - Usa cookies para leer la sesión del usuario
 * - Respeta Row Level Security (RLS)
 * - Solo ejecuta server-side, nunca en el cliente
 *
 * Uso en Server Component:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('dreams').select();
 *   return <div>{data}</div>;
 * }
 * ```
 *
 * Uso en Server Action:
 * ```tsx
 * 'use server';
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function saveDream(formData: FormData) {
 *   const supabase = await createClient();
 *   await supabase.from('dreams').insert({ ... });
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Silenciar errores en middleware (cookies son read-only)
            // Ver: https://supabase.com/docs/guides/auth/server-side/nextjs
          }
        },
      },
    },
  );
}

/**
 * Cliente Admin de Supabase que BYPASEA Row Level Security
 *
 * ⚠️ USAR CON EXTREMO CUIDADO
 *
 * - Usa service_role key (acceso total a la DB)
 * - NO respeta RLS policies
 * - Solo para operaciones administrativas
 *
 * Casos de uso válidos:
 * - Crear perfiles de usuario automáticamente
 * - Operaciones de migración
 * - Scripts administrativos
 *
 * ❌ NUNCA usar para:
 * - Queries normales de usuarios
 * - Exponer datos al cliente
 * - Operaciones que deberían respetar RLS
 */
export function createAdminClient() {
  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op para admin client
        },
      },
    },
  );
}
