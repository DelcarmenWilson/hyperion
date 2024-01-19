import { db } from "@/lib/db";

export const messagesGetByConversationId = async (conversationId: string) => {
  try {
    const messages = await db.message.findMany({
      where: { conversationId },
      include: { hasSeen: true },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};
