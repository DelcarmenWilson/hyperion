"use server";
import { db } from "@/lib/db";

export const getMessagesByChat = async (chatId: string) => {
  return await db.chatMessage.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
  });
};
