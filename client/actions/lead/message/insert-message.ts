"use server";
import { db } from "@/lib/db";

import { MessageSchema, MessageSchemaType } from "@/schemas/message";

export const insertMessage = async (values: MessageSchemaType) => {
  const { success, data } = MessageSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");
  const conversation = await db.leadConversation.findUnique({
    where: { id: data.conversationId },
  });

  if (!conversation) throw new Error("Conversation does not exists!");

  const newMessage = await db.leadMessage.create({
    data: {
      ...data,
    },
  });

  await db.leadConversation.update({
    where: { id: data.conversationId },
    data: {
      lastMessageId: newMessage.id,
      unread:
        conversation.leadId == data.senderId ? conversation.unread + 1 : 0,
    },
  });

  return newMessage;
};
