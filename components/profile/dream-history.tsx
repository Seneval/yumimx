/**
 * DreamHistory Component
 *
 * Displays list of user's dreams with preview
 * Click to view full conversation in modal
 */

"use client";

import { useState, useEffect } from "react";
import { Calendar, MessageSquare } from "lucide-react";
import { DreamDetailModal } from "./dream-detail-modal";

interface Dream {
  id: string;
  title: string | null;
  content: string;
  dream_date: string;
  created_at: string;
}

export function DreamHistory() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dreams/history");

      if (!response.ok) {
        throw new Error("Error al cargar historial");
      }

      const data = await response.json();
      setDreams(data.dreams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-violet-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (dreams.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-violet-500/30 dark:bg-white/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-violet-500/20">
          <MessageSquare className="h-8 w-8 text-gray-400 dark:text-violet-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          No hay sueños aún
        </h3>
        <p className="text-gray-600 dark:text-violet-200">
          Tus sueños interpretados aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dreams.map((dream) => (
          <button
            key={dream.id}
            onClick={() => setSelectedDreamId(dream.id)}
            className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-400 hover:shadow-md dark:border-violet-400/30 dark:bg-white/10 dark:hover:border-violet-400 dark:hover:bg-white/20"
          >
            {/* Date */}
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-violet-300">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(dream.dream_date).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-violet-400">
              {dream.title || "Sin título"}
            </h3>

            {/* Content Preview */}
            <p className="line-clamp-3 text-sm text-gray-700 dark:text-violet-100">
              {dream.content}
            </p>

            {/* View button hint */}
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-violet-400">
              <MessageSquare className="h-4 w-4" />
              Ver conversación
            </div>
          </button>
        ))}
      </div>

      {/* Dream Detail Modal */}
      {selectedDreamId && (
        <DreamDetailModal
          dreamId={selectedDreamId}
          open={!!selectedDreamId}
          onOpenChange={(open) => {
            if (!open) setSelectedDreamId(null);
          }}
        />
      )}
    </>
  );
}
