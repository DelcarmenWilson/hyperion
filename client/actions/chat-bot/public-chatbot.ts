"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { chatFetch } from "../gpt";
import {
  PublicChatbotMessageSchema,
  PublicChatbotMessageSchemaType,
} from "@/schemas/chat-bot/publicchatbot";
import {
  initialMessages,
  publicChatPropmts,
} from "@/constants/public-chat-bot";

//DATA
export const publicChatbotConversationsGet = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) return [];

    const publicConversations = await db.publicChatbotConversation.findMany({
      include: { lastMessage: true },
      orderBy: { updatedAt: "desc" },
    });
    return publicConversations;
  } catch {
    return [];
  }
};
export const publicChatbotConversationGetById = async (id: string) => {
  try {
    const publicConversation = await db.publicChatbotConversation.findUnique({
      where: {
        id,
      },
      include: { messages: true },
    });
    return publicConversation;
  } catch {
    return null;
  }
};

//ACTIONS
//CONVERSATION
export const publicChatbotConversationInsert = async () => {
  const user = await currentUser();
  if (!user?.email) return { error: "Unathentiacted" };

  const conversation = await db.publicChatbotConversation.create({ data: {} });

  if (!conversation.id) return { error: "Conversation was not created!" };

  //Get a random number based on the amount of propmts
  const promptIndex = Math.floor(Math.random() * publicChatPropmts.length);
  const prompt = publicChatPropmts[promptIndex];

  //Get a random number based on the amount of inital messages
  const initialMessageIndex = Math.floor(
    Math.random() * initialMessages.length
  );
  const initialMessage = initialMessages[initialMessageIndex];

  await db.publicChatbotMessage.createMany({
    data: [
      {
        conversationId: conversation.id,
        content: prompt,
        role: "system",
      },
      {
        conversationId: conversation.id,
        role: "assistant",
        content: initialMessage,
      },
    ],
  });

  const newMessage = await db.publicChatbotMessage.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!newMessage) return { error: "Message was not created" };

  await db.publicChatbotConversation.update({
    where: { id: conversation.id },
    data: {
      lastMessage: { connect: newMessage },
    },
  });

  return { success: conversation.id };
};

export const publicChatbotConversationDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!" };

  const existingConversation = await db.publicChatbotConversation.findUnique({
    where: { id },
  });
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }

  await db.publicChatbotConversation.delete({ where: { id } });

  return { success: "conversation has been deleted" };
};
//MESSAGE
export const publicChatbotMessageInsert = async (
  values: PublicChatbotMessageSchemaType
) => {
  const validatedFields = PublicChatbotMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { conversationId, content, role } = validatedFields.data;

  const existingConversation = await db.publicChatbotConversation.findUnique({
    where: { id: conversationId },
  });

  if (!existingConversation) return { error: "Conversation does not exists!!" };

  let messages = await db.publicChatbotMessage.findMany({
    where: { conversationId },
  });

  const newMessage = await db.publicChatbotMessage.create({
    data: { content, conversationId, role },
  });

  messages.push(newMessage);
  const chatMessage = await chatFetch(messages);
  const response = chatMessage.choices[0].message;

  const newChatMessage = await db.publicChatbotMessage.create({
    data: {
      content: response.content as string,
      conversationId,
      role: response.role,
    },
  });

  await db.publicChatbotConversation.update({
    where: { id: conversationId },
    data: {
      lastMessage: { connect: newChatMessage },
    },
  });

  return { success: [newMessage, newChatMessage] };
  // return { success: [newMessage] };
};
