"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteConversation = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const existingConversation = await db.leadConversation.findUnique({
    where: { id, agentId: user.id },
  });
  if (!existingConversation) throw new Error("Conversation does not exist!");

  await db.leadConversation.delete({ where: { id } });
};
