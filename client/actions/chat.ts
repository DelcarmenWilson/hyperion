"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ChatMessageSchema, ChatMessageSchemaType } from "@/schemas/chat";
import { UnreadShortChat } from "@/types";

// CHAT
//DATA
export const chatsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }

    const chats = await db.chat.findMany({
      where: {
        OR: [
          {
            userOne: { id: user.id },
          },
          {
            userTwo: { id: user.id },
          },
        ],
      },
      include: { userOne: true, userTwo: true, lastMessage: true },
      orderBy: { updatedAt: "desc" },
    });

    return chats;
  } catch {
    return [];
  }
};

export const chatGetById = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    const chat = await db.chat.findUnique({
      where: { id },
      include: {
        messages: { include: { sender: true }, orderBy: { createdAt: "desc" } },
        userOne: true,
        userTwo: true,
        lastMessage: true,
      },
    });
    return chat;
  } catch (error) {
    return null;
  }
};
export const chatGetByUserId = async (userId: string) => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    const chat = await db.chat.findFirst({
      where: {
        OR: [
          { userOneId: userId, userTwoId: user.id },
          { userOneId: user.id, userTwoId: userId },
        ],
      },
      include: {
        messages: { include: { sender: true } },
        userOne: true,
        userTwo: true,
        lastMessage: true,
      },
    });
    return chat;
  } catch (error) {
    return null;
  }
};

export const chatsGetByUserIdUnread = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }

    const chats = await db.chat.findMany({
      where: {
        OR: [
          {
            userOne: { id: user.id },
          },
          {
            userTwo: { id: user.id },
          },
        ],
        AND: [
          { lastMessage: { senderId: { not: user.id } } },
          { unread: { gt: 0 } },
        ],
      },
      include: {
        userOne: true,
        userTwo: true,
        lastMessage: { include: { sender: true } },
      },
    });
    return chats as UnreadShortChat[];
  } catch {
    return [];
  }
};

// CHAT MESSAGES
export const messagesGetByChatId = async (chatId: string) => {
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
export const chatInsert = async (userId: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  const exisitingChat = await db.chat.findFirst({
    where: {
      OR: [
        { userOneId: userId, userTwoId: user.id },
        { userOneId: user.id, userTwoId: userId },
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

export const chatUpdateByIdUnread = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }

  if (id == "clear") {
    id = "";
    await db.chat.updateMany({
      where: {
        OR: [
          {
            userOne: { id: user.id },
          },
          {
            userTwo: { id: user.id },
          },
        ],
        AND: [
          { lastMessage: { senderId: { not: user.id } } },
          { unread: { gt: 0 } },
        ],
      },
      data: { unread: 0 },
    });
  } else {
    const existingChat = await db.chat.findUnique({
      where: { id },
    });
    if (!existingChat) {
      return { error: "Chat does not exist!" };
    }
    await db.chat.update({ where: { id }, data: { unread: 0 } });
  }

  return { success: id };
};

// CHAT MESSAGES
// ACTIONS
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
