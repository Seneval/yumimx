import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Callback handler para Google OAuth
 *
 * Flujo:
 * 1. Usuario click en "Iniciar sesión con Google" en la landing
 * 2. Redirige a Google para autorización
 * 3. Google redirige de vuelta a esta ruta con un code
 * 4. Intercambiamos el code por una sesión de Supabase
 * 5. Redirigimos al usuario a /chat (o a donde quisiera ir originalmente)
 *
 * URL de callback configurada en Google Cloud Console:
 * https://jdkrvzttjccvcqoxdmst.supabase.co/auth/v1/callback
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect") || "/chat";

  if (code) {
    const supabase = await createClient();

    // Intercambiar code por sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Login exitoso → redirigir a /chat o a donde quería ir
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    // Si hay error, redirigir a landing con mensaje de error
    console.error("Error en OAuth callback:", error);
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  // Si no hay code, redirigir a landing
  return NextResponse.redirect(`${origin}/`);
}
