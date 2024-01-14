"use server";
import * as z from "zod";

import { MessageSchema } from "@/schemas";
import { db } from "@/lib/db";

export const messageInsert = async (values: z.infer<typeof MessageSchema>,conversationId:string) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role,content } = validatedFields.data;

  await db.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });

  return { success: "Message Created!" };
};