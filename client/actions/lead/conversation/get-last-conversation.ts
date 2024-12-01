"use server";
import { db } from "@/lib/db";
import { getAssitantForUser } from "@/actions/user";

export const getLastConversation = async () => {
  const agentId = await getAssitantForUser();
  if (!agentId) throw new Error("Unauthenticated!");

  return await db.leadConversation.findFirst({
    where: { agentId },
    orderBy: { updatedAt: "desc" },
  });
};
