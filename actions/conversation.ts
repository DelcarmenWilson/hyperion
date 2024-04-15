"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const conversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }

    const conversations = await db.conversation.findMany({
      where: { agentId: user.id },
      include: {
        lead: true,
        messages: true,
      },
      orderBy: { updatedAt: "desc" },
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
      where: { id: conversationId, agentId: user.id },
      include: {
        lead: {
          include: { calls: true, appointments: true, activities: true,beneficiaries:true,expenses:true },
        },
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
        lead:  {
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
  userId: string,
  leadId: string,
) => {
  if (!userId) {
    return { error: "User id is Required!" };
  }

  if (!leadId) {
    return { error: "Lead id is Required!" };
  }

  const conversation = await db.conversation.create({
    data: {
      leadId,
      agentId:userId
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }


  return  ({success:conversation.id} );
};

export const conversationDeleteById = async (
  id: string,
) => {
  const user=await currentUser()
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingConversation=await db.conversation.findUnique({where:{id}})
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }
  
  if (existingConversation.agentId!==user.id) {
    return { error: "Unauthorized!" };
  }

  await db.conversation.delete({where:{id}})
  


  return  ({success:"conversation has been deleted"} );
};

export const conversationUpdateByIdAutoChat = async (
  id: string,autoChat:boolean
) => {
  const user=await currentUser()
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const existingConversation=await db.conversation.findUnique({where:{id}})
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }
  
  if (existingConversation.agentId!==user.id) {
    return { error: "Unauthorized!" };
  }

  await db.conversation.update({where:{id},data:{autoChat}})
  
  return  ({success:`hyper chat has been turned ${autoChat?"on":"off"} `} );
};