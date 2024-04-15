"use server";
import * as z from "zod";

import { MessageSchema } from "@/schemas";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

//DATA
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

//ACTIONS
export const messageInsert = async (
  values: z.infer<typeof MessageSchema>
) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role, content,conversationId,senderId,hasSeen,sid } = validatedFields.data;

 
  const newMessage = await db.message.create({
    data: {
      conversationId,
      role,
      content,
      hasSeen,
      senderId,
      sid,      
    },include:{}
  });

  const conversation=await db.conversation.update({where:{id:conversationId},data:{lastMessage:content}})
  
  await pusherServer.trigger(conversationId, "messages:new", newMessage);
  await pusherServer.trigger(senderId, "messages:new", conversation);

  return { success: newMessage };
};
