"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteMessage = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const message = await db.chatMessage.findUnique({ where: { id } });

  if (!message) return { error: "Message not found" };

  if (message.senderId != user.id) return { error: "Unauthorized" };

  const deletedMessage = await db.chatMessage.update({
    where: { id },
    data: { deletedBy: user.id },
  });

  return id;
};
