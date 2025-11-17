"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function NewDreamForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dreamDate: new Date().toISOString().split("T")[0], // Today's date
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate
      if (!formData.title.trim() || !formData.content.trim()) {
        setError("Por favor completa todos los campos");
        setIsLoading(false);
        return;
      }

      // Create dream
      const response = await fetch("/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sueño");
      }

      // Redirect to chat
      router.push(`/chat/${data.dream.id}`);
    } catch (err) {
      console.error("Error creating dream:", err);
      setError(err instanceof Error ? err.message : "Error al crear sueño");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título del sueño</Label>
        <Input
          id="title"
          type="text"
          placeholder="Ej: Sueño sobre volar"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          disabled={isLoading}
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dreamDate">Fecha del sueño</Label>
        <Input
          id="dreamDate"
          type="date"
          value={formData.dreamDate}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dreamDate: e.target.value }))
          }
          disabled={isLoading}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          Describe tu sueño
          <span className="ml-2 text-xs text-gray-500">
            ({formData.content.length}/10000)
          </span>
        </Label>
        <Textarea
          id="content"
          placeholder="Escribe aquí todos los detalles que recuerdes de tu sueño..."
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          disabled={isLoading}
          className="min-h-[200px] resize-none"
          maxLength={10000}
        />
        <p className="text-xs text-gray-500">
          Incluye todos los detalles que recuerdes: personas, lugares,
          emociones, colores, etc.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando sueño...
          </>
        ) : (
          "Crear sueño e iniciar interpretación"
        )}
      </Button>
    </form>
  );
}
