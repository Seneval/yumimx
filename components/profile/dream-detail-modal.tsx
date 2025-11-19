/**
 * DreamDetailModal Component
 *
 * Shows full dream content and conversation history
 * Uses shadcn Dialog component
 */

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Dream {
  id: string;
  title: string | null;
  content: string;
  dream_date: string;
  created_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface DreamDetailModalProps {
  dreamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DreamDetailModal({
  dreamId,
  open,
  onOpenChange,
}: DreamDetailModalProps) {
  const [dream, setDream] = useState<Dream | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && dreamId) {
      fetchDreamDetails();
    }
  }, [dreamId, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchDreamDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/dreams/${dreamId}/messages`);

      if (!response.ok) {
        throw new Error("Error al cargar conversación");
      }

      const data = await response.json();
      setDream(data.dream);
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden bg-white dark:bg-gradient-to-br dark:from-purple-950 dark:to-indigo-950">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 dark:text-white">
            {loading ? "Cargando..." : dream?.title || "Sin título"}
          </DialogTitle>
          {!loading && dream && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-violet-300">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(dream.dream_date).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-violet-400" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dream Content */}
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-violet-400/30 dark:bg-violet-500/10">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-violet-300">
                  El Sueño
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-white">
                  {dream?.content}
                </p>
              </div>

              {/* Conversation Messages */}
              {messages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-violet-300">
                    Conversación
                  </h3>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-violet-600 dark:to-purple-600"
                            : "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white dark:backdrop-blur"
                        }`}
                      >
                        {message.role === "user" ? (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </p>
                        ) : (
                          <div className="prose prose-sm max-w-none text-sm leading-relaxed dark:prose-invert prose-p:my-2 prose-strong:font-bold prose-strong:text-inherit">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
