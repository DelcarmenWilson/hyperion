"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const getChats = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.chat.findMany({
    where: {
      OR: [{ userOneId: user.id }, { userTwoId: user.id }],
      NOT: { lastMessageId: null },
    },
    include: { userOne: true, userTwo: true, lastMessage: true },
    orderBy: { lastMessage: { createdAt: "desc" } },
  });
};
