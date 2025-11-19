"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { ThemeToggle } from "@/components/theme-toggle";
import ReactMarkdown from "react-markdown";

export function Hero() {
  const [dream, setDream] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInterpret = async () => {
    if (!dream.trim() || dream.length < 50) {
      alert("Por favor describe tu sueño con al menos 50 caracteres");
      return;
    }

    setIsLoading(true);
    setInterpretation("");

    try {
      const response = await fetch("/api/public/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream }),
      });

      if (!response.ok) throw new Error("Error al interpretar");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No se pudo leer la respuesta");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                setInterpretation((prev) => prev + parsed.chunk);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al interpretar tu sueño");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-violet-500/30 dark:bg-black/20 dark:backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Yumi<span className="text-indigo-600 dark:text-violet-400">MX</span>
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white text-gray-900 dark:from-purple-950 dark:via-indigo-900 dark:to-violet-950 dark:text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 dark:opacity-20">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-violet-500 mix-blend-multiply blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500 mix-blend-multiply blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 mix-blend-multiply blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
            {/* Left side - Hero content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-block">
                <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-violet-500/20 dark:text-violet-200 dark:backdrop-blur-sm">
                  Psicología Jungiana + Tecnología
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
                Descubre el{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-purple-400">
                  significado oculto
                </span>{" "}
                de tus sueños
              </h1>

              <p className="mb-8 text-xl text-gray-600 dark:text-violet-100">
                Interpretaciones profundas basadas en Carl Jung. Explora tu
                inconsciente, comprende tus arquetipos y transforma tu vida a
                través de tus sueños.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <GoogleLoginButton />
                <Button
                  variant="outline"
                  size="lg"
                  className="transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 dark:border-violet-400 dark:bg-transparent dark:text-white dark:hover:bg-violet-500/20"
                  onClick={() => {
                    document
                      .getElementById("demo")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Prueba gratis ahora ↓
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-200 pt-8 dark:border-violet-500/30">
                <div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-violet-300">
                    3M+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-violet-200">
                    Sueños interpretados
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-violet-300">
                    98%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-violet-200">
                    Satisfacción
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-violet-300">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600 dark:text-violet-200">
                    Disponible
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Interactive demo */}
            <div id="demo" className="flex flex-col justify-center">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-violet-500/30 dark:bg-white/10 dark:backdrop-blur-lg">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Prueba una interpretación gratis
                </h3>
                <p className="mb-6 text-gray-600 dark:text-violet-100">
                  Sin registro. Sin tarjeta. Solo curiosidad.
                </p>

                <Textarea
                  placeholder="Describe tu sueño aquí... (mínimo 50 caracteres, máximo 2,000)"
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  className="mb-4 min-h-[150px] bg-gray-50 text-gray-900 placeholder:text-gray-500 dark:bg-white/90"
                  disabled={isLoading}
                  maxLength={2000}
                />

                <Button
                  onClick={handleInterpret}
                  disabled={isLoading || dream.length < 50}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md dark:from-violet-500 dark:to-purple-600 dark:hover:from-violet-600 dark:hover:to-purple-700"
                  size="lg"
                >
                  {isLoading ? "Interpretando..." : "Interpretar mi sueño"}
                </Button>

                {interpretation && (
                  <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 text-gray-900 dark:border-violet-400/50 dark:bg-white/90">
                    <h4 className="mb-3 font-semibold text-indigo-900 dark:text-violet-900">
                      Interpretación:
                    </h4>
                    <div className="prose prose-sm max-w-none text-gray-900">
                      <ReactMarkdown>{interpretation}</ReactMarkdown>
                    </div>
                    <div className="mt-4 rounded-lg bg-indigo-100 p-4 text-xs text-indigo-800 dark:bg-violet-50 dark:text-violet-800">
                      💡 Crea una cuenta gratuita para guardar tus sueños y
                      tener conversaciones más profundas con el asistente.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
