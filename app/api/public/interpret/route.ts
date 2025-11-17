/**
 * Public Interpret API Route
 *
 * POST /api/public/interpret - Interpret dream without authentication
 *
 * This is a public endpoint that allows users to try dream interpretation
 * without creating an account. Limited to basic interpretation with no follow-up.
 */

import { NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/openai/client";

/**
 * POST /api/public/interpret
 *
 * Body:
 * - dream: string (required, min 50 chars, max 1000 chars)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dream } = body;

    // Validation
    if (!dream || typeof dream !== "string") {
      return new Response(
        JSON.stringify({ error: "Descripción del sueño requerida" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (dream.trim().length < 50) {
      return new Response(
        JSON.stringify({
          error: "El sueño debe tener al menos 50 caracteres",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (dream.length > 1000) {
      return new Response(
        JSON.stringify({
          error: "Para sueños más largos, por favor crea una cuenta gratuita",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create a temporary thread for this interpretation
    const openai = getOpenAIClient();
    const thread = await openai.beta.threads.create();

    // Add dream to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Sueño: ${dream}`,
    });

    // Run assistant with streaming (using free assistant)
    const stream = await openai.beta.threads.runs.stream(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID_FREE!,
    });

    // Transform OpenAI stream to Response stream
    let fullResponse = "";
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
                if (contentBlock.type === "text" && contentBlock.text?.value) {
                  const chunk = contentBlock.text.value;
                  fullResponse += chunk;

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
                `[Public Interpret] Completed interpretation for thread ${thread.id}`,
              );
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            }

            // Handle errors
            if (event.event === "thread.run.failed") {
              console.error("[Public Interpret] Run failed:", event.data);
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    error: "Error al interpretar",
                  })}\n\n`,
                ),
              );
            }
          }
        } catch (error) {
          console.error("[Public Interpret] Stream error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Error en el stream" })}\n\n`,
            ),
          );
        } finally {
          // Clean up thread after interpretation (optional)
          try {
            await openai.beta.threads.delete(thread.id);
          } catch (e) {
            console.error("[Public Interpret] Error deleting thread:", e);
          }
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
    console.error("[Public Interpret] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
