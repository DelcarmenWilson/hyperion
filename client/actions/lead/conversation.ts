"use server";
import { db } from "@/lib/db";
import { ShortConversation } from "@/types";
import { getAssitantForUser } from "@/actions/user";
import { currentUser } from "@/lib/auth";

//DATA
export const getConversations = async () => {
  const agentId = await getAssitantForUser();
  if (!agentId) throw new Error("Unauthenticated!");

  const conversations = await db.leadConversation.findMany({
    where: { agentId },
    include: {
      lead: true,
      lastCommunication: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const formattedConversations: ShortConversation[] = conversations.map(
    (conversation) => ({
      ...conversation,
      firstName: conversation.lead.firstName,
      lastName: conversation.lead.lastName,
      disposition: "",
      cellPhone: conversation.lead.cellPhone,
      lastCommunication: conversation.lastCommunication!,
      unread: conversation.unread
    })
  );
  return formattedConversations;
};

export const getConversation = async (id: string) => {
  const agentId = await getAssitantForUser();
  if (!agentId) throw new Error("Unauthenticated!");
  return await db.leadConversation.findUnique({
    where: { id, agentId },
    include: {
      lead: {
        include: {
          appointments: true,
          activities: true,
          beneficiaries: true,
          expenses: true,
          conditions: { include: { condition: true } },
          policy: true,
        },
      },
      communications: true,
      lastCommunication: true,
    },
  });
};

export const getConversationForLead = async (leadId: string) => {
  //TODO - may need to add the unthentcated user
  return await db.leadConversation.findFirst({
    where: { leadId },
    include: {
      lead: {
        include: { appointments: true, activities: true },
      },
      communications: true,
    },
  });
};

export const getLastConversation = async () => {
  const agentId = await getAssitantForUser();
  if (!agentId) throw new Error("Unauthenticated!");

  return await db.leadConversation.findFirst({
    where: { agentId },
    orderBy: { updatedAt: "desc" },
  });
};

export const getUnreadConversations = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.leadConversation.findMany({
    where: {
      agentId: user.id,
      unread: { gt: 0 },
    },
    include: { lastCommunication: true, lead: true },
  });
};

// ACTIONS
export const createConversation = async (agentId: string, leadId: string) => {
  if (!agentId) throw new Error("User id is Required!");

  if (!leadId) throw new Error("Lead id is Required!");

  const conversation = await db.leadConversation.create({
    data: {
      leadId,
      agentId,
    },
  });

  if (!conversation) throw new Error("Conversation was not created!");

  return conversation.id;
};

export const deleteConversation = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const existingConversation = await db.leadConversation.findUnique({
    where: { id, agentId: user.id },
  });
  if (!existingConversation) throw new Error("Conversation does not exist!");

  await db.leadConversation.delete({ where: { id } });
};

export const updateUnreadConversation = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  if (id == "clear") {
    id = "";
    await db.leadConversation.updateMany({
      where: {
        agentId: user.id,
        unread: { gt: 0 },
      },
      data: { unread: 0 },
    });

    await db.leadCommunication.updateMany({
      where: {
        conversation:{agentId: user.id,},        
        hasSeen: false,
      },
      data: { hasSeen: true },
    });
  } else {
    const existingConversation = await db.leadConversation.findUnique({
      where: { id },
    });
    if (!existingConversation) throw new Error("Conversation does not exist!");

    await db.leadConversation.update({ where: { id:existingConversation.id }, data: { unread: 0 } });

    await db.leadCommunication.updateMany({
      where: {
        conversationId:existingConversation.id,     
        hasSeen: false,
      },
      data: { hasSeen: true },
    });
  }

  return { success: id };
};
