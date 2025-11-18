/**
 * Profile Page
 *
 * User profile with:
 * - Account info and tier
 * - Personal context editor (Pro only)
 * - Upgrade prompt (Free users)
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TierService } from "@/lib/tier-check";
import { ContextForm } from "@/components/profile/context-form";
import { TierBadge } from "@/components/tier/tier-badge";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DreamHistory } from "@/components/profile/dream-history";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get user tier
  const userTier = await TierService.getUserTier(user.id);

  // Get user context (only for paid users)
  let initialContext = "";
  if (userTier === "paid") {
    const { data: contextData } = await supabase
      .from("user_context")
      .select("context_data")
      .eq("user_id", user.id)
      .single();

    initialContext = contextData?.context_data || "";
  }

  // Get stats
  const { count: dreamCount } = await supabase
    .from("dreams")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: messageCount } = await supabase
    .from("dream_messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user");

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-900 dark:to-violet-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-violet-500 mix-blend-multiply blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500 mix-blend-multiply blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative border-b border-gray-200 bg-white dark:border-violet-500/30 dark:bg-black/20 dark:backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/chat"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Yumi<span className="text-indigo-600 dark:text-violet-400">MX</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button
                variant="outline"
                className="border-indigo-600 bg-transparent text-gray-900 hover:bg-indigo-50 dark:border-violet-400 dark:text-white dark:hover:bg-violet-500/20"
              >
                Mis Sueños
              </Button>
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
            Mi Perfil
          </h1>
          <p className="text-xl text-gray-700 dark:text-violet-100">
            {user.email}
          </p>
        </div>

        {/* Account Card */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-violet-500/30 dark:bg-white/10 dark:backdrop-blur-lg">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Cuenta
              </h2>
              <p className="mt-2 text-gray-600 dark:text-violet-200">
                {user.user_metadata.full_name || "Usuario de YumiMX"}
              </p>
            </div>
            <TierBadge tier={userTier} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="group rounded-2xl border border-indigo-200 bg-indigo-50 p-6 transition-all hover:border-indigo-400 hover:bg-indigo-100 dark:border-violet-400/30 dark:bg-violet-500/10 dark:hover:border-violet-400 dark:hover:bg-violet-500/20">
              <div className="text-4xl font-bold text-indigo-600 dark:text-violet-300">
                {dreamCount || 0}
              </div>
              <div className="mt-2 text-sm text-indigo-700 dark:text-violet-200">
                Sueños registrados
              </div>
            </div>

            <div className="group rounded-2xl border border-purple-200 bg-purple-50 p-6 transition-all hover:border-purple-400 hover:bg-purple-100 dark:border-purple-400/30 dark:bg-purple-500/10 dark:hover:border-purple-400 dark:hover:bg-purple-500/20">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-300">
                {messageCount || 0}
              </div>
              <div className="mt-2 text-sm text-purple-700 dark:text-purple-200">
                Mensajes enviados
              </div>
            </div>

            <div className="group rounded-2xl border border-indigo-200 bg-indigo-50 p-6 transition-all hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/20">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-300">
                {userTier === "paid" ? "∞" : "3"}
              </div>
              <div className="mt-2 text-sm text-indigo-700 dark:text-indigo-200">
                Mensajes por sueño
              </div>
            </div>

            <div className="group rounded-2xl border border-violet-200 bg-violet-50 p-6 transition-all hover:border-violet-400 hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-500/10 dark:hover:border-violet-400 dark:hover:bg-violet-500/20">
              <div className="text-4xl font-bold text-violet-600 dark:text-violet-300">
                {userTier === "paid" ? "Sí" : "No"}
              </div>
              <div className="mt-2 text-sm text-violet-700 dark:text-violet-200">
                Contexto personal
              </div>
            </div>
          </div>
        </div>

        {/* Context Section - Pro users */}
        {userTier === "paid" && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-violet-500/30 dark:bg-white/10 dark:backdrop-blur-lg">
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Contexto Personal
              </h2>
              <p className="text-gray-700 dark:text-violet-200">
                Cuéntale al asistente sobre ti para recibir interpretaciones más
                precisas y personalizadas.
              </p>
            </div>

            <ContextForm initialContext={initialContext} />
          </div>
        )}

        {/* Upgrade Section - Free users */}
        {userTier === "free" && (
          <div className="relative overflow-hidden rounded-3xl border-2 border-violet-400 bg-gradient-to-br from-violet-600/20 to-purple-600/20 p-12 backdrop-blur-lg">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500 opacity-20 blur-3xl" />

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-4xl shadow-xl">
                ✨
              </div>

              <h2 className="mb-4 text-4xl font-bold text-white">
                Actualiza a Pro
              </h2>
              <p className="mb-8 text-xl text-violet-100">
                Desbloquea interpretaciones personalizadas y mucho más
              </p>

              <div className="mb-8 overflow-hidden rounded-2xl border border-violet-300/30 bg-white/90 p-8 text-left backdrop-blur">
                <h3 className="mb-6 text-xl font-bold text-gray-900">
                  Incluye todo de Free, más:
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Contexto Personal
                      </div>
                      <div className="text-sm text-gray-600">
                        El asistente recuerda tu vida y situación
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Mensajes Ilimitados
                      </div>
                      <div className="text-sm text-gray-600">
                        Profundiza sin límites en cada sueño
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Diario Completo
                      </div>
                      <div className="text-sm text-gray-600">
                        Historial completo de sueños e interpretaciones
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Análisis de Patrones
                      </div>
                      <div className="text-sm text-gray-600">
                        Identifica temas recurrentes en tu inconsciente
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="h-14 bg-gradient-to-r from-violet-500 to-purple-600 px-12 text-lg font-semibold shadow-2xl hover:from-violet-600 hover:to-purple-700"
              >
                Actualizar a Pro - $9.99/mes
              </Button>

              <p className="mt-6 text-sm text-violet-200">
                Prueba gratis por 7 días • Cancela cuando quieras
              </p>
            </div>
          </div>
        )}

        {/* Dream History Section */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-violet-500/30 dark:bg-white/10 dark:backdrop-blur-lg">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Historial de Sueños
            </h2>
            <p className="text-gray-700 dark:text-violet-200">
              {dreamCount === 0
                ? "Aún no has registrado ningún sueño. Comienza a escribir tus sueños para ver tu historial aquí."
                : `Tienes ${dreamCount} sueño${
                    dreamCount === 1 ? "" : "s"
                  } registrado${dreamCount === 1 ? "" : "s"}. ${
                    userTier === "free"
                      ? "Actualiza a Pro para que el asistente use este historial como contexto."
                      : "Como usuario Pro, el asistente usa tus últimos 3 sueños como contexto."
                  }`}
            </p>
          </div>

          <DreamHistory />
        </div>

        {/* Danger Zone */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:backdrop-blur-lg">
          <h2 className="mb-4 text-xl font-bold text-red-700 dark:text-red-300">
            Zona peligrosa
          </h2>
          <p className="mb-6 text-sm text-red-600 dark:text-red-200">
            Estas acciones son permanentes y no se pueden deshacer.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="border-red-600 bg-transparent text-red-700 hover:bg-red-100 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              Eliminar todos mis sueños
            </Button>
            <Button
              variant="outline"
              className="border-red-600 bg-transparent text-red-700 hover:bg-red-100 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              Eliminar mi cuenta
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
