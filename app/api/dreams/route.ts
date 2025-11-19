/**
 * Dreams API Route
 *
 * POST /api/dreams - Create new dream with OpenAI thread
 */

import { NextRequest, NextResponse } from "next/server";
import { withTierGuard } from "@/lib/guards/tier-guard";
import { createClient } from "@/lib/supabase/server";
import { createThread, addMessageToThread } from "@/lib/openai/threads";
import { CHAR_LIMITS } from "@/lib/constants/limits";

/**
 * POST /api/dreams
 *
 * Creates a new dream and associated OpenAI thread
 *
 * Body:
 * - content: string (required, min 50 chars)
 * - title: string (optional)
 * - dream_date: string (optional, ISO date)
 */
export const POST = withTierGuard(async (request, { userId, userTier }) => {
  try {
    const body = await request.json();
    const { content, title, dream_date } = body;

    // Validation
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "El contenido del sueño es requerido" },
        { status: 400 },
      );
    }

    if (content.length < CHAR_LIMITS.PUBLIC_DREAM_MIN) {
      return NextResponse.json(
        {
          error: `El sueño debe tener al menos ${CHAR_LIMITS.PUBLIC_DREAM_MIN} caracteres`,
        },
        { status: 400 },
      );
    }

    // Apply different limits based on user tier
    const maxLength =
      userTier === "paid"
        ? CHAR_LIMITS.PAID_MESSAGE_MAX
        : CHAR_LIMITS.FREE_MESSAGE_MAX;

    if (content.length > maxLength) {
      return NextResponse.json(
        {
          error: `El sueño no puede exceder ${maxLength.toLocaleString()} caracteres`,
        },
        { status: 400 },
      );
    }

    // 1. Create OpenAI thread
    const threadId = await createThread();

    // 2. Add dream content to thread as first message
    const dreamMessage = `Título: ${
      title || "Sin título"
    }\n\nContenido del sueño:\n${content}`;
    await addMessageToThread(threadId, dreamMessage, "user");

    // 3. Save dream to database with thread_id
    const supabase = await createClient();
    const { data: dream, error } = await supabase
      .from("dreams")
      .insert({
        user_id: userId,
        content,
        title: title || null,
        dream_date: dream_date || new Date().toISOString().split("T")[0],
        thread_id: threadId,
      })
      .select()
      .single();

    if (error) {
      console.error("[API Dreams] Database error:", error);
      return NextResponse.json(
        { error: "Error al crear el sueño" },
        { status: 500 },
      );
    }

    console.log(
      `[API Dreams] Created dream ${dream.id} with thread ${threadId}`,
    );

    return NextResponse.json({ dream }, { status: 201 });
  } catch (error) {
    console.error("[API Dreams] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
});
