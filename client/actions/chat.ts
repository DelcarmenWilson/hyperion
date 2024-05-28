"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ChatMessageSchema,ChatMessageSchemaType } from "@/schemas/chat";

// CHAT
export const chatInsert = async (userId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  const exisitingChat = await db.chat.findFirst({
    where: {
      AND: [
        {
          OR: [
            { userOneId: userId, userTwoId: user.id },
            { userOneId: user.id, userTwoId: userId },
          ],
        },
      ],
    },
  });
  if (exisitingChat) {
    return { success: exisitingChat };
  }

  if (!userId) {
    return { error: "Userd is Required!" };
  }

  const userTwo = await db.user.findUnique({ where: { id: userId } });
  if (!userTwo) {
    return { error: "User was not found" };
  }

  const chat = await db.chat.create({
    data: {
      userOneId: user.id,
      userTwoId: userTwo.id,
      // name: userTwo.userName,
      name: `${userTwo.firstName.substring(0, 1)}${userTwo.lastName.substring(
        0,
        1
      )}`,
      isGroup: false,
    },
  });

  if (!chat.id) {
    return { error: "Chat was not created!" };
  }

  return { success: chat };
};

export const chatGroupInsert = async (
  userId: string,
  name: string,
  isGroup: boolean = false
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  if (!userId) {
    return { error: "User id is Required!" };
  }

  const chat = await db.chat.create({
    data: {
      userOneId: user.id,
      userTwoId: userId,
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
  });
  if (!existingChat) {
    return { error: "Chat does not exist!" };
  }

  if (existingChat.userOneId != user.id) {
    return { error: "Unauthorized!" };
  }

  await db.chat.delete({ where: { id } });

  return { success: "chat has been deleted" };
};

// CHAT MESSAGES
export const chatMessageInsert = async (
  values: ChatMessageSchemaType
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
    },include:{sender:true}
  });

  await db.chat.update({
    where: { id: chatId },
    data: { lastMessage: content },
  });

  return { success: newMessage };
};
