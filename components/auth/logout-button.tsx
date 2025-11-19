"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Error al cerrar sesión. Intenta de nuevo.");
        return;
      }

      // Redirigir a landing
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border dark:border-violet-400 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
    >
      {isLoading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
