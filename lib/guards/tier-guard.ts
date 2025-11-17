/**
 * Tier Guard - Middleware for protecting API routes by tier
 *
 * IMPORTANT: This file contains server-only logic.
 * Use this to wrap API route handlers that require specific tiers.
 *
 * Example usage:
 *
 * export const GET = withTierGuard(
 *   async (request, { userId }) => {
 *     // Your handler logic here
 *     // userId is guaranteed to be present
 *     return NextResponse.json({ data: 'something' });
 *   },
 *   'paid' // Required tier
 * );
 */

import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TierService } from "@/lib/tier-check";
import type { UserTier } from "@/types/subscription";

// Context passed to the wrapped handler
export interface GuardContext {
  params?: any;
  userId: string;
  userTier: UserTier;
  body?: any; // Parsed request body (for guards that need to read body)
}

// Handler function type with guaranteed userId in context
// Supports both NextResponse (for JSON) and Response (for streaming)
export type GuardedHandler = (
  request: NextRequest,
  context: GuardContext,
) => Promise<NextResponse | Response>;

/**
 * Higher-order function to protect API routes by tier
 *
 * @param handler - The API route handler to protect
 * @param requiredTier - The minimum tier required ('free' or 'paid')
 * @returns Wrapped handler with tier checking
 */
export function withTierGuard(
  handler: GuardedHandler,
  requiredTier: UserTier = "free",
) {
  return async (
    request: NextRequest,
    context?: { params?: Promise<any> },
  ): Promise<NextResponse | Response> => {
    try {
      // 1. Check authentication
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: "No autorizado. Inicia sesión para continuar." },
          { status: 401 },
        );
      }

      // 2. Get user tier
      const userTier = await TierService.getUserTier(user.id);

      // 3. Check tier requirement
      if (requiredTier === "paid" && userTier !== "paid") {
        return NextResponse.json(
          {
            error:
              "Esta función requiere una cuenta Pro. Actualiza tu plan para continuar.",
            requiredTier: "paid",
            currentTier: userTier,
          },
          { status: 403 },
        );
      }

      // 4. Resolve params if it exists (Next.js 16 async params)
      const resolvedParams = context?.params ? await context.params : undefined;

      // 5. Call the actual handler with guaranteed userId
      return await handler(request, {
        params: resolvedParams,
        userId: user.id,
        userTier,
      });
    } catch (error) {
      console.error("[TierGuard] Unexpected error:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 },
      );
    }
  };
}

/**
 * Guard specifically for message sending
 * Checks both authentication and message limits for a dream
 *
 * @param handler - The API route handler
 * @param getDreamId - Function to extract dreamId from parsed request body
 * @returns Wrapped handler with message limit checking
 */
export function withMessageLimitGuard(
  handler: GuardedHandler,
  getDreamId: (body: any) => Promise<string> | string,
) {
  return async (
    request: NextRequest,
    context?: { params?: Promise<any> },
  ): Promise<NextResponse | Response> => {
    try {
      // 1. Check authentication
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: "No autorizado. Inicia sesión para continuar." },
          { status: 401 },
        );
      }

      // 2. Parse request body once
      const body = await request.json();

      // 3. Get dream ID from parsed body
      const dreamId = await getDreamId(body);

      // 4. Verify dream ownership
      const isOwner = await TierService.isDreamOwner(user.id, dreamId);
      if (!isOwner) {
        return NextResponse.json(
          { error: "No tienes permiso para acceder a este sueño." },
          { status: 403 },
        );
      }

      // 5. Check message limits
      const canSend = await TierService.canSendMessage(user.id, dreamId);
      if (!canSend) {
        const limits = await TierService.getMessageLimitInfo(user.id, dreamId);
        return NextResponse.json(
          {
            error: "Has alcanzado el límite de mensajes para este sueño.",
            limits,
            upgradeRequired: true,
          },
          { status: 429 }, // Too Many Requests
        );
      }

      // 6. Resolve params if it exists (Next.js 16 async params)
      const resolvedParams = context?.params ? await context.params : undefined;

      // 7. Get user tier and call handler with parsed body in context
      const userTier = await TierService.getUserTier(user.id);

      return await handler(request, {
        params: resolvedParams,
        userId: user.id,
        userTier,
        body, // Pass parsed body so handler doesn't need to re-parse
      });
    } catch (error) {
      console.error("[MessageLimitGuard] Unexpected error:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 },
      );
    }
  };
}
