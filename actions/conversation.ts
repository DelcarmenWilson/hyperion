"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const conversationInsert = async (
  userId: string,
  leadId: string,
  autoChat:boolean=false
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
      agentId:userId,
      autoChat
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