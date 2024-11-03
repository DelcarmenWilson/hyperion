"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UnreadShortChat } from "@/types";

// CHAT
//DATA
export const chatsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) return [];

    const chats = await db.chat.findMany({
      where: {
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
      },
      include: { userOne: true, userTwo: true, lastMessage: true },
      orderBy: { lastMessage: { createdAt: "desc" } },
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
        messages: {
          include: { sender: true, reactions: true },
          orderBy: { createdAt: "desc" },
          where:{hidden:false}
        },
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
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
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
//ACTIONS
export const chatDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const existingChat = await db.chat.findUnique({
    where: { id },
  });
  if (!existingChat) return { error: "Chat does not exist!" };

  if (existingChat.lastMessageId) return { error: "Cannot delete chat!" };

  if (existingChat.userOneId != user.id) return { error: "Unauthorized!" };

  await db.chat.delete({ where: { id } });

  return { success: "chat has been deleted" };
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

export const chatUpdateByIdUnread = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  if (id == "clear") {
    id = "";
    await db.chat.updateMany({
      where: {
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
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
