"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ChatMessageSchema, ChatMessageSchemaType } from "@/schemas/chat";


//DATA
// CHAT MESSAGES
export const chatMessageGetChatId = async (chatId: string) => {
  try {
    const messages = await db.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};
//TODO - need to come back to this

// export const messagesGetByAgentIdUnSeen = async (senderId: string) => {
//   try {
//     const messages = await db.leadMessage.aggregate({
//       _count:{id:true},
//       where: {senderId,hasSeen:false },
//     });

//     return messages._count.id;;
//   } catch (error: any) {
//     return 0;
//   }
// };

//ACTIONS
export const chatMessageDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const message = await db.chatMessage.findUnique({ where: { id } });

  if (!message) return { error: "Message not found" };

  if (message.senderId != user.id) return { error: "Unauthorized" };

  const deletedMessage = await db.chatMessage.update({
    where: { id },
    data: { deletedBy: user.id },
  });

  return { success: deletedMessage };
};

export const chatMessageInsert = async (values: ChatMessageSchemaType) => {
  const validatedFields = ChatMessageSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { chatId, body, image, senderId } = validatedFields.data;

  const chat = await db.chat.findUnique({
    where: { id: chatId },
    include: { lastMessage: true },
  });
  if (!chat) return { error: "Chat does not exists!!" };

  const newMessage = await db.chatMessage.create({
    data: {
      chatId: chat.id,
      body,
      image,
      senderId,
    },
    include: { sender: true },
  });

  await db.chat.update({
    where: { id: chatId },
    data: {
      lastMessageId: newMessage.id,
      unread: chat.lastMessage?.senderId == senderId ? chat.unread + 1 : 0,
    },
  });

  return { success: newMessage };
};

export const chatMessageUpdateById = async ({
  id,
  body,
}: {
  id: string;
  body: string;
}) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const message = await db.chatMessage.findUnique({ where: { id } });

  if (!message) return { error: "Message not found" };

  if (message.senderId != user.id) return { error: "Unauthorized" };

  const newMessage = await db.chatMessage.update({
    where: { id },
    data: { body },
  });

  return { success: newMessage };
};
