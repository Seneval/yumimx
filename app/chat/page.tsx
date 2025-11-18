import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MainChatInterface } from "@/components/chat/main-chat-interface";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <MainChatInterface userId={user.id} userEmail={user.email || ""} />;
}
