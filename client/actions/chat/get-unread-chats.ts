"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UnreadShortChat } from "@/types";

export const getUnreadChats = async () => {

    const user = await currentUser();
    if (!user)  throw new Error("Unauthenticated!" );

    const chats= await db.chat.findMany({
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
  }
