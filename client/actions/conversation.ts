"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
//DATA
export const conversationsGetByUserIdUnread = async () => {
   try {
  const user = await currentUser();
  if (!user?.email) {
    return [];
  }
  const conversations = await db.conversation.findMany({
    where: {
      agentId: user.id,
      lastMessage: { senderId: { not: user.id } },
      unread: { gt: 0 },
    },
    include: { lastMessage: true, lead: true },
  });
  return conversations;
  } catch {
    return [];
  }
};
//ACTIONS
export const conversationInsert = async (
  agentId: string,
  leadId: string,
  autoChat: boolean = false
) => {
  if (!agentId) {
    return { error: "User id is Required!" };
  }

  if (!leadId) {
    return { error: "Lead id is Required!" };
  }

  const conversation = await db.conversation.create({
    data: {
      leadId,
      agentId,
      autoChat,
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }

  return { success: conversation.id };
};

export const conversationDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingConversation = await db.conversation.findUnique({
    where: { id },
  });
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }

  if (existingConversation.agentId !== user.id) {
    return { error: "Unauthorized!" };
  }

  await db.conversation.delete({ where: { id } });

  return { success: "conversation has been deleted" };
};

export const conversationUpdateByIdAutoChat = async (
  id: string,
  autoChat: boolean
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const existingConversation = await db.conversation.findUnique({
    where: { id },
  });
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }

  if (existingConversation.agentId !== user.id) {
    return { error: "Unauthorized!" };
  }

  await db.conversation.update({ where: { id }, data: { autoChat } });

  return { success: `Titan chat has been turned ${autoChat ? "on" : "off"} ` };
};

export const conversationUpdateByIdUnread = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  if (id == "clear") {
    id = "";
    await db.conversation.updateMany({
      where: {
        agentId: user.id,
           lastMessage: { senderId: { not: user.id  } },
           unread: { gt: 0 } ,
        
      },
      data: { unread: 0 },
    });
  } else {
    const existingConversation = await db.conversation.findUnique({
      where: { id },
    });
    if (!existingConversation) {
      return { error: "Conversation does not exist!" };
    }
    await db.conversation.update({ where: { id }, data: { unread: 0 } });
  }

  return { success: id };
};
