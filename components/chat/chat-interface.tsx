/**
 * ChatInterface Component
 *
 * Main chat interface with:
 * - Message history display
 * - Message sending with streaming
 * - Tier-based message limits
 * - Upgrade prompts
 * - Auto-scrolling
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useMessageLimits } from "@/hooks/useMessageLimits";
import { MessageCounter } from "@/components/tier/message-counter";
import { UpgradePrompt } from "@/components/tier/upgrade-prompt";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatLoadingState } from "./chat-loading-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  dreamId: string;
  initialMessages: Message[];
}

export function ChatInterface({
  dreamId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { limits, loading: limitsLoading, refetch } = useMessageLimits(dreamId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Check limits before sending
    if (!limits?.canSendMessage) {
      setShowUpgrade(true);
      return;
    }

    setError(null);

    // Add user message optimistically
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamId, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.upgradeRequired) {
          setShowUpgrade(true);
          // Remove optimistic user message
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== userMessage.id),
          );
          return;
        }
        throw new Error(errorData.error || "Error al enviar mensaje");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        const assistantMsgId = `assistant-${Date.now()}`;

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          { id: assistantMsgId, role: "assistant", content: "" },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.error) {
                  setError(parsed.error);
                  break;
                }

                if (parsed.chunk) {
                  assistantMessage += parsed.chunk;

                  // Update assistant message with accumulated content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, content: assistantMessage }
                        : msg,
                    ),
                  );
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }

      // Refetch limits after successful message
      await refetch();
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        error instanceof Error ? error.message : "Error al enviar mensaje",
      );

      // Remove optimistic user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const canSend = limits?.canSendMessage && !isLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Header with message counter */}
      {limits && !limitsLoading && (
        <div className="p-4 border-b">
          <MessageCounter limits={limits} />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <ChatLoadingState />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput
          onSend={handleSendMessage}
          disabled={!canSend}
          placeholder={
            canSend
              ? "Escribe tu mensaje..."
              : "Has alcanzado el límite de mensajes. Actualiza a Pro para continuar."
          }
        />
      </div>

      {/* Upgrade prompt */}
      <UpgradePrompt open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
