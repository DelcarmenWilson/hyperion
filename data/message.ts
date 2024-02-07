import { db } from "@/lib/db";

export const messagesGetByConversationId = async (conversationId: string) => {
  try {
    const messages = await db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export const messagesGetByAgentIdUnSeen = async (senderId: string) => {
  try {
    const messages = await db.message.aggregate({
      _count:{id:true},      
      where: {senderId,hasSeen:false },
    });

    return messages._count.id;;
  } catch (error: any) {
    return 0;
  }
};
