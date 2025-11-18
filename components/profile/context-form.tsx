"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContextFormProps {
  initialContext?: string;
}

export function ContextForm({ initialContext = "" }: ContextFormProps) {
  const [context, setContext] = useState(initialContext);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Template fields to help user structure their context
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [family, setFamily] = useState("");
  const [interests, setInterests] = useState("");
  const [challenges, setChallenges] = useState("");
  const [goals, setGoals] = useState("");

  const handleGenerateContext = () => {
    const parts = [];

    if (age) parts.push(`Edad: ${age}`);
    if (occupation) parts.push(`Ocupación: ${occupation}`);
    if (family) parts.push(`Familia: ${family}`);
    if (interests) parts.push(`Intereses: ${interests}`);
    if (challenges) parts.push(`Desafíos actuales: ${challenges}`);
    if (goals) parts.push(`Metas personales: ${goals}`);

    setContext(parts.join("\n\n"));
  };

  const handleSave = async () => {
    if (!context.trim()) {
      setSaveMessage("Por favor escribe algo de contexto");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/profile/context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al guardar");
      }

      setSaveMessage("✓ Contexto guardado exitosamente");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving context:", error);
      setSaveMessage("Error al guardar. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Helper fields */}
      <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-6 backdrop-blur">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Ayuda rápida: Completa estos campos
        </h3>
        <p className="mb-6 text-sm text-violet-200">
          Llena los campos que quieras y luego da clic en "Generar contexto"
          para crear automáticamente tu descripción.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              placeholder="ej: 32 años"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="occupation">Ocupación</Label>
            <Input
              id="occupation"
              placeholder="ej: Diseñadora gráfica"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="family">Familia y relaciones</Label>
            <Textarea
              id="family"
              placeholder="ej: Casada, 2 hijos (8 y 12 años), vivo con mis padres cerca..."
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="interests">Intereses y pasiones</Label>
            <Textarea
              id="interests"
              placeholder="ej: Yoga, lectura de filosofía, jardinería..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="challenges">Desafíos o situaciones actuales</Label>
            <Textarea
              id="challenges"
              placeholder="ej: Cambio de carrera, búsqueda de propósito, duelo reciente..."
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="goals">Metas personales</Label>
            <Textarea
              id="goals"
              placeholder="ej: Encontrar balance trabajo-vida, mejorar relaciones, autoconocimiento..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <Button
          onClick={handleGenerateContext}
          variant="outline"
          className="mt-4 w-full border-violet-400 bg-transparent text-white hover:bg-violet-500/20"
        >
          Generar contexto automático
        </Button>
      </div>

      {/* Main context field */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label
            htmlFor="context"
            className="text-base font-semibold text-white"
          >
            Tu contexto personal
          </Label>
          <span className="text-sm text-violet-300">
            {context.length} caracteres
          </span>
        </div>

        <p className="mb-4 text-sm text-violet-200">
          Este contexto se usará para personalizar todas tus interpretaciones.
          Puedes editarlo directamente aquí o usar los campos de arriba.
        </p>

        <Textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Escribe aquí información sobre ti que ayude al asistente a entender mejor tus sueños...

Ejemplo:
Tengo 35 años, trabajo como profesor de secundaria. Estoy en proceso de separación después de 10 años de matrimonio. Tengo dos hijas (7 y 9 años) que viven conmigo la mitad del tiempo. Actualmente estoy explorando mi identidad fuera de la relación y buscando un nuevo sentido de propósito. Me interesa mucho la filosofía existencial y el arte."
          className="min-h-[300px]"
        />

        <div className="mt-4 rounded-lg border border-violet-400/30 bg-violet-500/10 p-4 text-sm text-violet-200">
          <strong>💡 Tip:</strong> Mientras más específico seas, mejores serán
          las interpretaciones. Incluye información sobre tu vida actual,
          desafíos, relaciones importantes, y qué buscas descubrir sobre ti
          mismo.
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={isSaving || !context.trim()}
          className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          size="lg"
        >
          {isSaving ? "Guardando..." : "Guardar contexto"}
        </Button>

        {saveMessage && (
          <span
            className={`text-sm font-medium ${
              saveMessage.startsWith("✓") ? "text-green-400" : "text-red-400"
            }`}
          >
            {saveMessage}
          </span>
        )}
      </div>
    </div>
  );
}
