"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getChatForUserId = async (userId: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.chat.findFirst({
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
};
