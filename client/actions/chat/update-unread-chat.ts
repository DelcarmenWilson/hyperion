"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const updateUnreadChat = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!" );

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
    await db.chat.update({ where: { id }, data: { unread: 0 } });
  }

};
