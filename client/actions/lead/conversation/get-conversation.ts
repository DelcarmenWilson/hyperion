"use server";
import { db } from "@/lib/db";
import { getAssitantForUser } from "@/actions/user";

export const getConversation = async (conversationId: string) => {
  const agentId = await getAssitantForUser();
  if (!agentId) throw new Error("Unauthenticated!");
  return await db.leadConversation.findUnique({
    where: { id: conversationId, agentId },
    include: {
      lead: {
        include: {
          calls: true,
          appointments: true,
          activities: true,
          beneficiaries: true,
          expenses: true,
          conditions: { include: { condition: true } },
          policy: true,
        },
      },
      lastMessage: true,
      messages: true,
    },
  });
};
