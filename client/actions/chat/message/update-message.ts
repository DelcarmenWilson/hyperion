"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const updateMessage = async ({
  id,
  body,
}: {
  id: string;
  body: string;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const message = await db.chatMessage.findUnique({ where: { id } });

  if (!message) throw new Error("Message not found!");

  if (message.senderId != user.id) throw new Error("Unauthorized!");

  await db.chatMessage.update({
    where: { id },
    data: { body },
  });

  return id
};
