"use server";
import { db } from "@/lib/db";

export const createConversation = async (
  agentId: string,
  leadId: string,
) => {
  if (!agentId) throw new Error("User id is Required!")
  

  if (!leadId) throw new Error("Lead id is Required!")
  

  const conversation = await db.leadConversation.create({
    data: {
      leadId,
      agentId,
    },
  });

  if (!conversation) throw new Error("Conversation was not created!")

  return  conversation.id ;
};