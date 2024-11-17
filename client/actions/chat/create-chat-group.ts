"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";


export const createChatGroup = async (
  userId: string,
  name: string,
  isGroup: boolean = false
) => {
  const user = await currentUser();
  if (!user)  throw new Error("Unauthenticated!" );


  const chat = await db.chat.create({
    data: {
      userOneId: user.id,
      userTwoId: userId,
      name,
      isGroup,
    },
  });

  if (!chat.id) if (!user)  throw new Error("Chat was not created!" );
  return  chat;
};
