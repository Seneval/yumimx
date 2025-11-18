"use client";

import Link from "next/link";
import { MessageSquare, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/types/database";

type Dream = Database["public"]["Tables"]["dreams"]["Row"];

interface DreamsListProps {
  dreams: Dream[];
}

export function DreamsList({ dreams }: DreamsListProps) {
  if (dreams.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:rounded-3xl dark:border-violet-400/30 dark:bg-violet-500/10 dark:backdrop-blur-lg">
        <div className="mx-auto mb-4 text-6xl">💭</div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Aún no has registrado ningún sueño
        </h3>
        <p className="text-sm text-gray-600 dark:text-violet-200">
          Completa el formulario arriba para comenzar tu primera interpretación
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Tus sueños ({dreams.length})
      </h2>
      <div className="grid gap-4">
        {dreams.map((dream) => (
          <Link key={dream.id} href={`/chat/${dream.id}`}>
            <Card className="transition-all hover:shadow-md hover:border-indigo-300 dark:border-violet-500/30 dark:bg-white/10 dark:backdrop-blur-lg dark:hover:border-violet-400 dark:hover:shadow-2xl dark:hover:shadow-violet-500/20 dark:hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                      {dream.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-violet-200">
                      {dream.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-violet-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(dream.dream_date).toLocaleDateString(
                          "es-MX",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Interpretar
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4 dark:text-violet-400 dark:transition-transform dark:group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
