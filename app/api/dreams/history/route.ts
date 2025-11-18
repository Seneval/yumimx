/**
 * Dreams History API Route
 *
 * GET /api/dreams/history - Get user's dream history list
 */

import { NextResponse } from "next/server";
import { withTierGuard } from "@/lib/guards/tier-guard";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/dreams/history
 *
 * Returns list of user's dreams ordered by date (most recent first)
 * Content is truncated to 200 chars for preview
 */
export const GET = withTierGuard(async (request, { userId }) => {
  try {
    const supabase = await createClient();

    // Fetch dreams for current user
    const { data: dreams, error } = await supabase
      .from("dreams")
      .select("id, title, content, dream_date, created_at")
      .eq("user_id", userId)
      .order("dream_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API Dreams History] Database error:", error);
      return NextResponse.json(
        { error: "Error al obtener historial de sueños" },
        { status: 500 },
      );
    }

    // Truncate content to 200 chars for preview
    const dreamsWithPreview = dreams.map((dream) => ({
      ...dream,
      content:
        dream.content.slice(0, 200) + (dream.content.length > 200 ? "..." : ""),
    }));

    return NextResponse.json({ dreams: dreamsWithPreview });
  } catch (error) {
    console.error("[API Dreams History] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 },
    );
  }
});
