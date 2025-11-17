/**
 * MessageCounter Component
 *
 * Displays remaining messages for free users.
 * Shows "Te quedan X mensajes" or "Mensajes ilimitados" for paid.
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { MessageLimitInfo } from "@/types/subscription";
import { MessageSquare, Sparkles } from "lucide-react";

interface MessageCounterProps {
  limits: MessageLimitInfo;
  className?: string;
}

export function MessageCounter({ limits, className }: MessageCounterProps) {
  // Paid users see unlimited badge
  if (limits.tier === "paid") {
    return (
      <Badge variant="secondary" className={className}>
        <Sparkles className="w-3 h-3 mr-1" />
        Mensajes ilimitados
      </Badge>
    );
  }

  // Free users see remaining count
  const { remainingMessages, canSendMessage } = limits;

  if (remainingMessages === 0) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription className="text-sm">
          Has alcanzado el límite de mensajes para este sueño.
        </AlertDescription>
      </Alert>
    );
  }

  // Warning when only 1 message left
  const variant = remainingMessages === 1 ? "default" : "secondary";

  return (
    <Badge variant={variant} className={className}>
      <MessageSquare className="w-3 h-3 mr-1" />
      Te {remainingMessages === 1 ? "queda" : "quedan"} {remainingMessages}{" "}
      {remainingMessages === 1 ? "mensaje" : "mensajes"}
    </Badge>
  );
}
