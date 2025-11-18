/**
 * Dream Context Builder Service
 *
 * Builds context from user's past dreams for paid users
 * Server-only utility for AI context injection
 */

import "server-only";
import { createClient } from "@/lib/supabase/server";

interface DreamContextData {
  dream_date: string;
  title: string | null;
  content: string;
  interpretation: string | null;
}

/**
 * Builds dream history context for paid users
 *
 * Fetches last 3 dreams (excluding current one) with their interpretations
 * Truncates content to reasonable limits to manage token usage:
 * - Dream content: 1000 chars max
 * - Interpretation: 300 chars max
 *
 * @param userId - The user ID
 * @param currentDreamId - The current dream ID to exclude from context
 * @returns Formatted string for OpenAI additional instructions, or null if no dreams
 */
export async function buildDreamHistoryContext(
  userId: string,
  currentDreamId: string,
): Promise<string | null> {
  try {
    const supabase = await createClient();

    // Fetch last 3 dreams (excluding current)
    const { data: dreams, error: dreamsError } = await supabase
      .from("dreams")
      .select("id, dream_date, title, content, created_at")
      .eq("user_id", userId)
      .neq("id", currentDreamId)
      .order("dream_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);

    if (dreamsError) {
      console.error(
        "[Dream Context Builder] Error fetching dreams:",
        dreamsError,
      );
      return null;
    }

    if (!dreams || dreams.length === 0) {
      return null;
    }

    // Fetch interpretations (first assistant message) for each dream
    const contextData: DreamContextData[] = await Promise.all(
      dreams.map(async (dream) => {
        const { data: messages } = await supabase
          .from("dream_messages")
          .select("content")
          .eq("dream_id", dream.id)
          .eq("role", "assistant")
          .order("created_at", { ascending: true })
          .limit(1)
          .single();

        return {
          dream_date: dream.dream_date,
          title: dream.title,
          content: truncate(dream.content, 1000),
          interpretation: messages?.content
            ? truncate(messages.content, 300)
            : null,
        };
      }),
    );

    // Format context string
    const formattedDreams = contextData
      .map((data, index) => {
        const dateFormatted = new Date(data.dream_date).toLocaleDateString(
          "es-MX",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        let dreamSection = `[${dateFormatted}] ${
          data.title || "Sin t�tulo"
        }\nSue�o: ${data.content}`;

        if (data.interpretation) {
          dreamSection += `\nInterpretaci�n previa: ${data.interpretation}`;
        }

        return dreamSection;
      })
      .join("\n\n");

    const contextString = `Historial de sue�os recientes (�ltimos ${contextData.length}):

${formattedDreams}

Usa esta informaci�n para identificar patrones, s�mbolos recurrentes y evoluci�n personal en la interpretaci�n del sue�o actual.`;

    return contextString;
  } catch (error) {
    console.error("[Dream Context Builder] Unexpected error:", error);
    return null;
  }
}

/**
 * Truncates text to specified length, adding ellipsis if truncated
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}
