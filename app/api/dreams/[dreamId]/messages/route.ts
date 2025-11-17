/**
 * Dream Messages API Route
 *
 * GET /api/dreams/[dreamId]/messages - Get all messages for a dream
 */

import { NextRequest, NextResponse } from "next/server";
import { withTierGuard } from "@/lib/guards/tier-guard";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/dreams/[dreamId]/messages
 *
 * Returns all messages for a specific dream in chronological order
 */
export const GET = withTierGuard(async (request: NextRequest, context) => {
  const { dreamId } = context.params!;
  const { userId } = context;

  try {
    const supabase = await createClient();

    // Verify dream ownership
    const { data: dream, error: dreamError } = await supabase
      .from("dreams")
      .select("id")
      .eq("id", dreamId)
      .eq("user_id", userId)
      .single();

    if (dreamError || !dream) {
      return NextResponse.json(
        { error: "Sueño no encontrado" },
        { status: 404 },
      );
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from("dream_messages")
      .select("*")
      .eq("dream_id", dreamId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("[API Messages] Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Error al obtener mensajes" },
        { status: 500 },
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[API Messages] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
});
