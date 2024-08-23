"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { GptMessageSchema, GptMessageSchemaType } from "@/schemas/test";
import { chatFetch } from "./gpt";
import { error } from "console";

//DATA
export const gptConversationsGetByUserId = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }
    const conversations = await db.gptConversation.findMany({
      where: {
        userId: user.id,
      },
      include: { lastMessage: true },
      orderBy: { updatedAt: "desc" },
    });
    return conversations;
  } catch {
    return [];
  }
};
export const gptConversationGetById = async (id: string) => {
  try {
    const conversation = await db.gptConversation.findUnique({
      where: {
        id,
      },
      include: { messages: true },
    });
    return conversation;
  } catch {
    return null;
  }
};
//ACTIONS
export const gptConversationInsert = async () => {
  const user = await currentUser();
  if (!user?.email) {
    return { error: "Unathentiacted" };
  }

  const lastConv =await db.gptConversation.findFirst({
    where:{userId:user.id},
    orderBy: { updatedAt: "desc" },
    
  });

  if (!lastConv?.lastMessageId) return { error: "Last conversation is empty" };

  console.log(lastConv, lastConv.lastMessageId);
  const conversation = await db.gptConversation.create({
    data: {
      userId: user.id,
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }

  return { success: conversation.id };
};

export const gptConversationDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingConversation = await db.gptConversation.findUnique({
    where: { id },
  });
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }

  if (existingConversation.userId !== user.id) {
    return { error: "Unauthorized!" };
  }

  await db.gptConversation.delete({ where: { id } });

  return { success: "conversation has been deleted" };
};

export const gptMessageInsert = async (values: GptMessageSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = GptMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { conversationId, content, role } = validatedFields.data;

  const existingConversation = await db.gptConversation.findUnique({
    where: { id: conversationId },
  });

  if (!existingConversation) {
    return { error: "Conversation does not exists!!" };
  }

  let messages = await db.gptMessage.findMany({ where: { conversationId } });

  const newMessage = await db.gptMessage.create({
    data: { content, conversationId, role },
  });

  messages.push(newMessage);

  const chatMessage = await chatFetch(messages);
  const response = chatMessage.choices[0].message;

  const newChatMessage = await db.gptMessage.create({
    data: {
      content: response.content as string,
      conversationId,
      role: response.role,
    },
  });

  await db.gptConversation.update({
    where: { id: conversationId },
    data: {
      lastMessage: { connect: newChatMessage },
    },
  });

  return { success: [newMessage, newChatMessage] };
};

export const messageInsert = async (values: GptMessageSchemaType) => {
  const validatedFields = GptMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role, content, conversationId } = validatedFields.data;

  const conversation = await db.gptConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return { error: "Conversation does not exists!" };
  }

  const newMessage = await db.gptMessage.create({
    data: {
      conversationId,
      role,
      content,
    },
  });

  await db.gptConversation.update({
    where: { id: conversationId },
    data: { lastMessageId: newMessage.id },
  });

  return { success: newMessage };
};
