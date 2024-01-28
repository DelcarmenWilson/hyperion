"use server";
import * as z from "zod";

import { MessageSchema } from "@/schemas";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export const messageInsert = async (values: z.infer<typeof MessageSchema>,conversationId:string,hasSeen:boolean=false) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role,content } = validatedFields.data;

  const newMessage=await db.message.create({
    data: {
      conversationId,
      role,
      content,
      hasSeen
    },
  });
  await pusherServer.trigger(conversationId,'messages:new',newMessage)

  return { success: "Message Created!" };
};