"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const toggleReaction = async ({
  chatMessageId,
  name,
  value,
}: {
  chatMessageId: string;
  name:string
  value: string;
}) => {
  const user = await currentUser();
  if (!user)  throw new Error("Unauthenticated!" );
  const userId = user.id;

  const existingReaction = await db.chatMessageReaction.findFirst({
    where: { chatMessageId, userId, name },
  });

  if (existingReaction) {
    await db.chatMessageReaction.delete({ where: { id: existingReaction.id } });  
  } else {
    await db.chatMessageReaction.create({
      data: {
        userId,
        chatMessageId,
        name,
        value,
      },
    });
  }
};
