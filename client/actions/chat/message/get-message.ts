"use server";
import { db } from "@/lib/db";

export const getMessage= async (id: string) => {
  return await db.chatMessage.findUnique({
    where: { id },
    include: {
      sender: true,
      chat: { select: { userOneId: true, userTwoId: true } },
    },
  });
};
