"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ChatMessageSchema } from "@/schemas";

// CHAT
export const chatInsert = async (
  userId: string,
  name: string,
  isGroup: boolean = false
) => {
  if (!userId) {
    return { error: "User id is Required!" };
  }

  const chat = await db.chat.create({
    data: {
      users: { connect: { id: userId } },
      name,
      isGroup,
    },
  });

  if (!chat.id) {
    return { error: "Chat was not created!" };
  }

  return { success: chat };
};

export const chatDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingChat = await db.chat.findUnique({
    where: { id },
    include: { users: true },
  });
  if (!existingChat) {
    return { error: "Chat does not exist!" };
  }

  if (!existingChat.users.find((e) => e.id == user.id)) {
    return { error: "Unauthorized!" };
  }

  await db.chat.delete({ where: { id } });

  return { success: "chat has been deleted" };
};

// CHAT MESSAGES
export const chatMessageInsert = async (
  values: z.infer<typeof ChatMessageSchema>
) => {
  const validatedFields = ChatMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { chatId, content, attachment, senderId } = validatedFields.data;

  const newMessage = await db.chatMessage.create({
    data: {
      chatId,
      content,
      attachment,
      senderId,
    },
  });

  await db.chat.update({
    where: { id: chatId },
    data: { lastMessage: content },
  });

  return { success: newMessage };
};
