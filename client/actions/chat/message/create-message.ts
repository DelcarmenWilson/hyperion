"use server";
import { db } from "@/lib/db";
import {
  CreateChatMessageSchema,
  CreateChatMessageSchemaType,
} from "@/schemas/chat";

export const createMessage = async (values: CreateChatMessageSchemaType) => {
  const { success, data } = CreateChatMessageSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const chat = await db.chat.findUnique({
    where: { id: data.chatId },
    include: { lastMessage: true },
  });

  if (!chat) throw new Error("Chat does not exists!");

  const newMessage = await db.chatMessage.create({
    data: {
      ...data,
    },
    include: { sender: true },
  });

  await db.chat.update({
    where: { id: data.chatId },
    data: {
      lastMessageId: newMessage.id,
      unread: chat.lastMessage?.senderId == data.senderId ? chat.unread + 1 : 0,
    },
  });

  return newMessage ;
};
