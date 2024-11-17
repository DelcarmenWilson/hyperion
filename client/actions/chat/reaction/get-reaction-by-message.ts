"use server";
import { db } from "@/lib/db";

export const getReactionsByMessage = async (chatMessageId: string) => {
  return await db.chatMessageReaction.findMany({
    where: { chatMessageId },
    orderBy: { createdAt: "desc" },
  });
};
