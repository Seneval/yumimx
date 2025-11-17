/**
 * Chat API Route with Streaming
 *
 * POST /api/chat - Send message and stream assistant response
 *
 * This route handles:
 * - Message limit validation (via guard)
 * - Saving user message to DB
 * - Adding message to OpenAI thread
 * - Running assistant with streaming
 * - Streaming response to client
 * - Saving assistant response to DB
 */

import { NextRequest, NextResponse } from "next/server";
import { withMessageLimitGuard } from "@/lib/guards/tier-guard";
import { createClient } from "@/lib/supabase/server";
import { addMessageToThread, createThread } from "@/lib/openai/threads";
import { runAssistantStream } from "@/lib/openai/assistant-runner";
import { TierService } from "@/lib/tier-check";

/**
 * POST /api/chat
 *
 * Body:
 * - dreamId: string (required)
 * - message: string (required)
 */
export const POST = withMessageLimitGuard(
  async (request, { userId, userTier, body }) => {
    const supabase = await createClient();

    try {
      // Body is already parsed by the guard
      if (!body) {
        return NextResponse.json(
          { error: "No se recibió el cuerpo de la solicitud" },
          { status: 400 },
        );
      }

      const { dreamId, message } = body;

      // Validation
      if (
        !message ||
        typeof message !== "string" ||
        message.trim().length === 0
      ) {
        return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
      }

      if (message.length > 10000) {
        return NextResponse.json(
          { error: "Mensaje demasiado largo (máx 10,000 caracteres)" },
          { status: 400 },
        );
      }

      // Get dream with thread_id
      const { data: dream, error: dreamError } = await supabase
        .from("dreams")
        .select("thread_id, content")
        .eq("id", dreamId)
        .eq("user_id", userId)
        .single();

      if (dreamError || !dream) {
        return NextResponse.json(
          { error: "Sueño no encontrado" },
          { status: 404 },
        );
      }

      // Handle case where thread_id doesn't exist (legacy data)
      let threadId = dream.thread_id;
      if (!threadId) {
        console.log(
          `[API Chat] Dream ${dreamId} missing thread_id, creating retroactively`,
        );
        threadId = await createThread();

        // Update dream with new thread_id
        await supabase
          .from("dreams")
          .update({ thread_id: threadId })
          .eq("id", dreamId);
      }

      // 1. Save user message to database
      const { error: saveError } = await supabase
        .from("dream_messages")
        .insert({
          dream_id: dreamId,
          user_id: userId,
          role: "user",
          content: message,
        });

      if (saveError) {
        console.error("[API Chat] Error saving user message:", saveError);
        return NextResponse.json(
          { error: "Error al guardar mensaje" },
          { status: 500 },
        );
      }

      // 2. Add message to OpenAI thread
      await addMessageToThread(threadId, message, "user");

      // 3. Get user context for paid users (optional)
      let additionalInstructions: string | undefined;
      if (userTier === "paid") {
        const { data: context } = await supabase
          .from("user_context")
          .select("context_data")
          .eq("user_id", userId)
          .single();

        if (context?.context_data) {
          additionalInstructions = `Contexto del usuario: ${context.context_data}\n\nUsa esta información para personalizar tu interpretación.`;
        }
      }

      // 4. Run assistant with streaming
      const stream = await runAssistantStream(
        threadId,
        userTier,
        additionalInstructions,
      );

      // 5. Transform OpenAI stream to Response stream
      let fullAssistantMessage = "";
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              // Handle text deltas
              if (event.event === "thread.message.delta") {
                const delta = event.data.delta;
                if (delta.content && delta.content[0]) {
                  const contentBlock = delta.content[0];
                  if (
                    contentBlock.type === "text" &&
                    contentBlock.text?.value
                  ) {
                    const chunk = contentBlock.text.value;
                    fullAssistantMessage += chunk;

                    // Send chunk to client
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`),
                    );
                  }
                }
              }

              // Handle completion
              if (event.event === "thread.run.completed") {
                console.log(
                  `[API Chat] Run completed, saving assistant message`,
                );

                // Save complete assistant message to database
                await supabase.from("dream_messages").insert({
                  dream_id: dreamId,
                  user_id: userId,
                  role: "assistant",
                  content: fullAssistantMessage,
                });

                // Send completion signal
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }

              // Handle errors
              if (event.event === "thread.run.failed") {
                console.error("[API Chat] Run failed:", event.data);
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      error: "Error al procesar respuesta",
                    })}\n\n`,
                  ),
                );
              }
            }
          } catch (error) {
            console.error("[API Chat] Stream error:", error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: "Error en el stream" })}\n\n`,
              ),
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      console.error("[API Chat] Unexpected error:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 },
      );
    }
  },
  // Extract dreamId from parsed body
  (body) => {
    return body.dreamId;
  },
);
