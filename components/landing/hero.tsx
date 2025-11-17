"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GoogleLoginButton } from "@/components/auth/google-login-button";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-900 to-violet-950 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-violet-500 mix-blend-multiply blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500 mix-blend-multiply blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 mix-blend-multiply blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8">
          {/* Left side - Hero content */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-block">
              <span className="rounded-full bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-200 backdrop-blur-sm">
                Psicología Jungiana + Tecnología
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Descubre el{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                significado oculto
              </span>{" "}
              de tus sueños
            </h1>

            <p className="mb-8 text-xl text-violet-100">
              Interpretaciones profundas basadas en Carl Jung. Explora tu
              inconsciente, comprende tus arquetipos y transforma tu vida a
              través de tus sueños.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <GoogleLoginButton />
              <Button
                variant="outline"
                size="lg"
                className="border-violet-400 bg-transparent text-white hover:bg-violet-500/20"
                onClick={() => {
                  document
                    .getElementById("demo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Prueba gratis ahora ↓
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-violet-500/30 pt-8">
              <div>
                <div className="text-3xl font-bold text-violet-300">3M+</div>
                <div className="text-sm text-violet-200">
                  Sueños interpretados
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-violet-300">98%</div>
                <div className="text-sm text-violet-200">Satisfacción</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-violet-300">24/7</div>
                <div className="text-sm text-violet-200">Disponible</div>
              </div>
            </div>
          </div>

          {/* Right side - Interactive demo */}
          <div id="demo" className="flex flex-col justify-center">
            <div className="rounded-3xl border border-violet-500/30 bg-white/10 p-8 backdrop-blur-lg">
              <h3 className="mb-4 text-2xl font-bold">
                Prueba una interpretación gratis
              </h3>
              <p className="mb-6 text-violet-100">
                Sin registro. Sin tarjeta. Solo curiosidad.
              </p>

              <Textarea
                placeholder="Describe tu sueño aquí... (mínimo 50 caracteres)"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                className="mb-4 min-h-[150px] bg-white/90 text-gray-900 placeholder:text-gray-500"
                disabled={isLoading}
              />

              <Button
                onClick={handleInterpret}
                disabled={isLoading || dream.length < 50}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                size="lg"
              >
                {isLoading ? "Interpretando..." : "Interpretar mi sueño"}
              </Button>

              {interpretation && (
                <div className="mt-6 rounded-2xl border border-violet-400/50 bg-white/90 p-6 text-gray-900">
                  <h4 className="mb-3 font-semibold text-violet-900">
                    Interpretación:
                  </h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {interpretation}
                  </p>
                  <div className="mt-4 rounded-lg bg-violet-50 p-4 text-xs text-violet-800">
                    💡 Crea una cuenta gratuita para guardar tus sueños y tener
                    conversaciones más profundas con el asistente.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
