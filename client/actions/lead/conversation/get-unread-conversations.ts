"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getUnreadConversations = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.leadConversation.findMany({
    where: {
      agentId: user.id,
      lastMessage: { senderId: { not: user.id } },
      unread: { gt: 0 },
    },
    include: { lastMessage: true, lead: true },
  });
};
