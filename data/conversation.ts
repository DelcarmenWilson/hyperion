import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const conversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    const conversations = await db.conversation.findMany({
      include: {
        users: { where: { id: user?.id } },
        lead: true,
        messages: true,
      },
    });
    return conversations;
  } catch {
    return null;
  }
};

export const conversationGetById = async (conversationId: string) => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: { where: { id: user?.id } },
        lead: true,
        messages: { include: { sender: true, hasSeen: true } },
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};
export const conversationGetByLeadId = async (leadId: string) => {
  try {
    const conversation = await db.conversation.findFirst({
      where: { leadId },
      include: {
        lead: true,
        users: true,
        messages: { include: { sender: true, hasSeen: true } },
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};
