"use server";
import * as z from "zod";
import { db } from "@/lib/db";

import { MessageSchema } from "@/schemas";

export const messageInsert = async (values: z.infer<typeof MessageSchema>) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role, content, conversationId, attachment, senderId, hasSeen, sid } =
    validatedFields.data;

  const newMessage = await db.message.create({
    data: {
      conversationId,
      role,
      content,
      attachment,
      hasSeen,
      senderId,
      sid,
    },
  });

   await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessage: content },
  });

  return { success: newMessage };
};