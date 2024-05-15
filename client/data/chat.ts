import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

// CHAT
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
      },include:{userOne:true,userTwo:true}
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
      },
    });
    return chat;
  } catch (error) {
    return null;
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
