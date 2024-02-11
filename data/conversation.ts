import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const conversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }

    const conversations = await db.conversation.findMany({
      where:{agentId:user.id},
      include: {
        lead: true,
        messages: true,
      },orderBy:{updatedAt:"desc"}
    });

    return conversations;
  } catch {
    return [];
  }
};

export const conversationGetById = async (conversationId: string) => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId,agentId:user.id },
      include: {        
        lead: true,
        messages: true,
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
      where: { leadId},
      include: {
        lead: true,
        messages: true,
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};
