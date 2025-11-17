/**
 * Chat Page - Dream Interpretation Interface
 *
 * This page displays the chat interface for a specific dream
 * Server Component that fetches data and passes to client ChatInterface
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatInterface } from "@/components/chat";

interface ChatPageProps {
  params: Promise<{
    dreamId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { dreamId } = await params;
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get dream
  const { data: dream, error: dreamError } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", dreamId)
    .eq("user_id", user.id)
    .single();

  if (dreamError || !dream) {
    console.error("[Chat Page] Dream not found or access denied:", dreamError);
    redirect("/");
  }

  // Get messages
  const { data: messages, error: messagesError } = await supabase
    .from("dream_messages")
    .select("*")
    .eq("dream_id", dreamId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("[Chat Page] Error fetching messages:", messagesError);
  }

  return (
    <div className="container mx-auto h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">
            {dream.title || "Interpretación de Sueño"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(dream.dream_date).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full">
          <ChatInterface dreamId={dreamId} initialMessages={messages || []} />
        </div>
      </div>
    </div>
  );
}
