"use server";
import { db } from "@/lib/db";

import { MessageSchema,MessageSchemaType } from "@/schemas/message";

export const messageInsert = async (values: MessageSchemaType) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role, content, conversationId, attachment, senderId, hasSeen, sid } =
    validatedFields.data;

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId }
    });

  if(!conversation){  
    return { error: "Conversation does not exists!" };
  }

  const newMessage = await db.message.create({
    data: {
      conversationId,
      role,
      content,
      attachment,
      hasSeen,
      senderId,
      sid,
    },
  });

   await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessageId: newMessage.id, 
      unread:
      conversation.leadId == senderId
        ? conversation.unread + 1
        : 0, },
  });

  return { success: newMessage };
};
