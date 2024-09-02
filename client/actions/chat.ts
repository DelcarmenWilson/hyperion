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
      include: { userOne: true, userTwo: true, lastMessage: true },orderBy:{updatedAt:"desc"}
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
//     const messages = await db.message.aggregate({
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
export const chatMessageInsert = async (values: ChatMessageSchemaType) => {
  const validatedFields = ChatMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { chatId, content, attachment, senderId } = validatedFields.data;

  // let cid = chatId;
  // let conversation;

  // if (cid)
  //   conversation = await db.chat.findUnique({
  //     where: { id: cid },
  //     include: { lastMessage: true },
  //   });
  // else {
  //   conversation = await db.chat.findFirst({
  //     where: {
  //       OR: [
  //         { userOneId: senderId, userTwoId: userId },
  //         { userOneId: userId, userTwoId: senderId },
  //       ],
  //     },
  //     include: { lastMessage: true },
  //   });
  //   if (!conversation) {
  //     conversation = await db.chat.create({
  //       data: {
  //         userOneId: senderId,
  //         userTwoId: userId as string,
  //         isGroup: false,
  //         name: "",
  //       },
  //       include: { lastMessage: true },
  //     });
  //   }
  //   cid = conversation.id;
  // }

  // if (!conversation) {
  //   return { error: "Conversation was not created!!!" };
  // }

  const conversation = await db.chat.findUnique({
    where: { id: chatId },
    include: { lastMessage: true },
  });
  if (!conversation) {
    return { error: "Conversation does not exists!!" };
  }

  const newMessage = await db.chatMessage.create({
    data: {
      chatId: chatId as string,
      content,
      attachment,
      senderId,
    },
    include: { sender: true },
  });

  await db.chat.update({
    where: { id: chatId },
    data: {
      lastMessageId: newMessage.id,
      unread:
        conversation.lastMessage?.senderId == senderId
          ? conversation.unread + 1
          : 0,
    },
  });

  return { success: newMessage };
};
