"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, User, Menu } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MainChatInterfaceProps {
  userId: string;
  userEmail: string;
}

export function MainChatInterface({
  userId,
  userEmail,
}: MainChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentDreamId, setCurrentDreamId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // If no dream yet, create one
      if (!currentDreamId) {
        const dreamResponse = await fetch("/api/dreams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:
              userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : ""),
            content: userMessage,
            dreamDate: new Date().toISOString().split("T")[0],
          }),
        });

        if (!dreamResponse.ok) {
          throw new Error("Error al crear sueño");
        }

        const { dream } = await dreamResponse.json();
        setCurrentDreamId(dream.id);

        // Start interpretation
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dreamId: dream.id,
            message:
              "Interpreta este sueño basándote en la psicología Jungiana",
          }),
        });

        if (!chatResponse.ok) throw new Error("Error al interpretar");

        // Stream response
        const reader = chatResponse.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.chunk) {
                  assistantMessage += parsed.chunk;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore
              }
            }
          }
        }
      } else {
        // Continue conversation
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dreamId: currentDreamId,
            message: userMessage,
          }),
        });

        if (!chatResponse.ok) throw new Error("Error al enviar mensaje");

        // Stream response
        const reader = chatResponse.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.chunk) {
                  assistantMessage += parsed.chunk;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hubo un error. Intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDream = () => {
    setMessages([]);
    setCurrentDreamId(null);
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-900 dark:to-violet-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-violet-500/30 dark:bg-black/20 dark:backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Yumi<span className="text-indigo-600 dark:text-violet-400">MX</span>
          </h1>
          {currentDreamId && (
            <Button
              onClick={handleNewDream}
              variant="ghost"
              size="sm"
              className="text-sm transition-all duration-200 hover:scale-105 active:scale-95 dark:text-violet-300 dark:hover:bg-violet-500/20"
            >
              + Nuevo sueño
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/profile">
            <Button
              variant="ghost"
              size="icon"
              className="dark:text-white dark:hover:bg-violet-500/20"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl dark:from-violet-600 dark:to-purple-700">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
              Cuéntame tu sueño
            </h2>
            <p className="max-w-md text-gray-600 dark:text-violet-200">
              Describe tu sueño con todos los detalles que recuerdes. Recibirás
              una interpretación basada en la psicología Jungiana.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-violet-600 dark:to-purple-600"
                      : "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white dark:backdrop-blur"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  ) : (
                    <div className="prose prose-sm max-w-none text-sm leading-relaxed dark:prose-invert prose-p:my-2 prose-strong:font-bold prose-strong:text-inherit">
                      <ReactMarkdown>
                        {message.content || (isLoading ? "..." : "")}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4 dark:border-violet-500/30 dark:bg-black/20 dark:backdrop-blur-lg">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                currentDreamId
                  ? "Escribe tu pregunta o mensaje..."
                  : "Describe tu sueño aquí..."
              }
              className="min-h-[60px] max-h-[150px] resize-none dark:bg-white/20 dark:border-violet-400/30 dark:text-white dark:placeholder:text-violet-200/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="h-[60px] w-[60px] shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md dark:from-violet-500 dark:to-purple-600 dark:hover:from-violet-600 dark:hover:to-purple-700"
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-violet-300">
            {new Date().toLocaleDateString("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
