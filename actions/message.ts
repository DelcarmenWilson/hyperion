"use server";
import * as z from "zod";

import { MessageSchema } from "@/schemas";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

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
    },
  });

  const conversation=await db.conversation.update({where:{id:conversationId},data:{lastMessage:content}})
  
  await pusherServer.trigger(conversationId, "messages:new", newMessage);
  await pusherServer.trigger(senderId, "messages:new", conversation);

  return { success: "Message Created!" };
};
