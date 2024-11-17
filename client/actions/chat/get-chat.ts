"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getChat = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.chat.findUnique({
    where: { id },
    include: {
      messages: {
        include: { sender: true, reactions: true },
        orderBy: { createdAt: "desc" },
        where: { hidden: false },
      },
      userOne: true,
      userTwo: true,
      lastMessage: true,
    },
  });
};
