/**
 * Profile Context API Route
 *
 * GET /api/profile/context - Get user's personal context
 * PUT /api/profile/context - Update user's personal context
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CHAR_LIMITS } from "@/lib/constants/limits";

/**
 * GET /api/profile/context
 *
 * Returns the user's stored personal context
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get context
    const { data: context, error } = await supabase
      .from("user_context")
      .select("context_data")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned (not an error, just empty)
      console.error("[Profile Context] Error fetching context:", error);
      return NextResponse.json(
        { error: "Error al obtener contexto" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      context: context?.context_data || "",
    });
  } catch (error) {
    console.error("[Profile Context] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/profile/context
 *
 * Updates the user's personal context
 *
 * Body:
 * - context: string (required)
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get body
    const body = await request.json();
    const { context } = body;

    // Validation
    if (typeof context !== "string") {
      return NextResponse.json({ error: "Contexto inválido" }, { status: 400 });
    }

    if (context.length > CHAR_LIMITS.USER_CONTEXT_MAX) {
      return NextResponse.json(
        {
          error: `Contexto demasiado largo (máx ${CHAR_LIMITS.USER_CONTEXT_MAX.toLocaleString()} caracteres)`,
        },
        { status: 400 },
      );
    }

    // Upsert context (insert or update)
    const { error } = await supabase.from("user_context").upsert(
      {
        user_id: user.id,
        context_data: context,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      console.error("[Profile Context] Error saving context:", error);
      return NextResponse.json(
        { error: "Error al guardar contexto" },
        { status: 500 },
      );
    }

    console.log(`[Profile Context] Saved context for user ${user.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Profile Context] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
