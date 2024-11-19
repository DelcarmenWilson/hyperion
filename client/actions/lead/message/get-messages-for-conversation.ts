"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getMessagesForConversation = async (
  conversationId: string | null | undefined
) => {
  if (!conversationId) throw new Error("ConversationId was not supplied!!");
  const user = currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.leadMessage.findMany({
    where: { conversationId, role: { not: "system" } },
  });
};
