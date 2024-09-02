"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ShortConversation } from "@/types";
import { userGetByAssistant } from "@/data/user";
//DATA
export const conversationGetLast = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }

    let agentId = user.id;
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }

    const conversation = await db.conversation.findFirst({
      where: { agentId },
      orderBy: { updatedAt: "desc" },
    });

    return conversation;
  } catch {
    return null;
  }
};

export const conversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }

    let agentId = user.id;
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }

    const conversations = await db.conversation.findMany({
      where: { agentId },
      include: {
        lead: true,
        lastMessage:true,
        messages: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const  formattedConversations: ShortConversation[] = conversations.map(
      (conversation) => ({
        ...conversation,
        firstName: conversation.lead.firstName,
        lastName: conversation.lead.lastName,
        disposition: "",
        cellPhone: conversation.lead.cellPhone,
        message: conversation.lastMessage?.content!,
        unread: conversation.messages.filter((message) => !message.hasSeen)
          .length,
      })
    );
    return formattedConversations;
  } catch {
    return [];
  }
};

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

export const conversationGetById = async (conversationId: string) => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    
    let agentId = user.id;
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }
    const conversation = await db.conversation.findUnique({
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
        lastMessage:true,
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
      where: { leadId },
      include: {
        lead: {
          include: { calls: true, appointments: true, activities: true },
        },
        messages: true,
      },
    });
    return conversation;
  } catch (error) {
    return null;
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
