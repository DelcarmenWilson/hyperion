"use server";
import { db } from "@/lib/db";
import { userGetByAssistant } from "@/actions/user";

export const getLastConversation = async () => {
  const agentId = await userGetByAssistant();
  if (!agentId) throw new Error("Unauthenticated!");

  return await db.leadConversation.findFirst({
    where: { agentId },
    orderBy: { updatedAt: "desc" },
  });
};
