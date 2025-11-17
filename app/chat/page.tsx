import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { NewDreamForm } from "@/components/dreams/new-dream-form";
import { DreamsList } from "@/components/dreams/dreams-list";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default async function ChatPage() {
  const supabase = await createClient();

  // Obtener usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay usuario (por si acaso el middleware falla), redirigir
  if (!user) {
    redirect("/");
  }

  // Obtener perfil del usuario desde nuestra tabla
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Obtener sueños del usuario (ordenados por fecha más reciente)
  const { data: dreams } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Yumi<span className="text-indigo-600">MX</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500">
                Plan: {profile?.tier === "paid" ? "Premium" : "Gratuito"}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Interpretación de Sueños
          </h2>
          <p className="text-gray-600">
            Descubre el significado de tus sueños con psicología Jungiana
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Nuevo Sueño Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  Nuevo Sueño
                </CardTitle>
                <CardDescription>
                  Comparte tu sueño para recibir una interpretación basada en
                  Carl Jung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewDreamForm />
              </CardContent>
            </Card>
          </div>

          {/* Lista de Sueños */}
          <div>
            <DreamsList dreams={dreams || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
