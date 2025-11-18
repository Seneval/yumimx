/**
 * Dream Messages API Route
 *
 * GET /api/dreams/[dreamId]/messages - Get dream with full conversation
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/dreams/[dreamId]/messages
 *
 * Returns dream details with all associated messages
 * Requires authentication and ownership check
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dreamId: string }> },
) {
  try {
    const supabase = await createClient();
    const { dreamId } = await params;

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Fetch dream with ownership check
    const { data: dream, error: dreamError } = await supabase
      .from("dreams")
      .select("id, user_id, title, content, dream_date, created_at")
      .eq("id", dreamId)
      .eq("user_id", user.id)
      .single();

    if (dreamError || !dream) {
      return NextResponse.json(
        { error: "Sueño no encontrado" },
        { status: 404 },
      );
    }

    // Fetch all messages for this dream
    const { data: messages, error: messagesError } = await supabase
      .from("dream_messages")
      .select("id, role, content, created_at")
      .eq("dream_id", dreamId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error(
        "[API Dream Messages] Error fetching messages:",
        messagesError,
      );
      return NextResponse.json(
        { error: "Error al obtener mensajes" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      dream,
      messages: messages || [],
    });
  } catch (error) {
    console.error("[API Dream Messages] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 },
    );
  }
}
