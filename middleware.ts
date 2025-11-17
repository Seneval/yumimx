import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * Middleware de Next.js para autenticación con Supabase
 *
 * - Se ejecuta en TODAS las requests antes de llegar a las páginas
 * - Verifica si el usuario está autenticado
 * - Refresca tokens automáticamente
 * - Redirige a login si intenta acceder a rutas protegidas sin auth
 *
 * Rutas públicas (no requieren autenticación):
 * - / (landing page)
 * - /auth/* (callbacks de OAuth)
 * - /_next/* (archivos estáticos)
 * - /api/auth/* (endpoints de autenticación)
 *
 * Rutas protegidas (requieren autenticación):
 * - /chat
 * - /journal
 * - /settings
 * - /api/* (excepto /api/auth/*)
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: Esto refresca la sesión si está expirada
  // Sin esto, el usuario sería deslogueado automáticamente
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rutas públicas que NO requieren autenticación
  const publicRoutes = ["/", "/auth"];
  const isPublicRoute =
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    ) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth");

  // Si es ruta pública, permitir acceso
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Si NO está autenticado e intenta acceder a ruta protegida
  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Usuario autenticado → permitir acceso
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - public files (imágenes, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
