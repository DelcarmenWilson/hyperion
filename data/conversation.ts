import { db } from "@/lib/db";

export const ConversationsGetByUserId = async (userId: string) => {
  try {
    const conversations = await db.conversation.findMany({
      where: { userId },include:{lead:true}
    });
    return conversations;
  } catch {
    return null;
  }
};