"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  ChatbotMessageSchema,
  ChatbotMessageSchemaType,
  ChatbotSettingsSchema,
  ChatbotSettingsSchemaType,
} from "@/schemas/chatbot";
import { chatFetch } from "./gpt";

//DATA
export const chatbotConversationsGet = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return [];
    }
    const conversations = await db.chatbotConversation.findMany({
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
export const chatbotConversationGetById = async (id: string) => {
  try {
    const conversation = await db.chatbotConversation.findUnique({
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

export const chatbotGetActive = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    const settings = await db.chatbotSettings.findFirst({
      where: { userId: user.id, active: true },
    });
    return settings;
  } catch {
    return null;
  }
};
//ACTIONS
//CONVERSATION
export const chatbotConversationInsert = async () => {
  const user = await currentUser();
  if (!user?.email) {
    return { error: "Unathentiacted" };
  }

  const lastConvo = await db.chatbotConversation.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  
  if (lastConvo && !lastConvo.lastMessageId)
    return { error: "Last conversation is empty" };

  const conversation = await db.chatbotConversation.create({
    data: {
      userId: user.id,
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }

  const settings = await chatbotGetActive();

  if (settings) {
    await db.chatbotMessage.create({
      data: {
        content: settings.prompt,
        conversationId: conversation.id,
        role: "system",
      },
    });
  }

  return { success: conversation.id };
};

export const chatbotConversationDeleteById = async (id: string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const existingConversation = await db.chatbotConversation.findUnique({
    where: { id },
  });
  if (!existingConversation) {
    return { error: "Conversation does not exist!" };
  }

  if (existingConversation.userId !== user.id) {
    return { error: "Unauthorized!" };
  }

  await db.chatbotConversation.delete({ where: { id } });

  return { success: "conversation has been deleted" };
};
//MESSAGE
export const chatbotMessageInsert = async (values: ChatbotMessageSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = ChatbotMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { conversationId, content, role } = validatedFields.data;

  const existingConversation = await db.chatbotConversation.findUnique({
    where: { id: conversationId },
  });

  if (!existingConversation) {
    return { error: "Conversation does not exists!!" };
  }

  let messages = await db.chatbotMessage.findMany({ where: { conversationId } });

  const newMessage = await db.chatbotMessage.create({
    data: { content, conversationId, role },
  });

  messages.push(newMessage);

  const chatMessage = await chatFetch(messages);
  const response = chatMessage.choices[0].message;

  const newChatMessage = await db.chatbotMessage.create({
    data: {
      content: response.content as string,
      conversationId,
      role: response.role,
    },
  });

  await db.chatbotConversation.update({
    where: { id: conversationId },
    data: {
      lastMessage: { connect: newChatMessage },
    },
  });

  return { success: [newMessage, newChatMessage] };
};

//SETTINGS
export const chatbotSettingsInsert = async (values: ChatbotSettingsSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = ChatbotSettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { prompt, leadInfo } = validatedFields.data;

  const activeSettings = await db.chatbotSettings.findFirst({
    where: { userId: user.id, active: true },
  });

  if (activeSettings) {
    await db.chatbotSettings.update({
      where: { id: activeSettings.id },
      data: { active: false },
    });
  }

  const newSettings = await db.chatbotSettings.create({
    data: { userId: user.id, prompt, leadInfo },
  });

  return { success: newSettings };
};

export const chatbotSettingsUpsert = async (values: ChatbotSettingsSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = ChatbotSettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, prompt, leadInfo } = validatedFields.data;

  const activeSettings = await db.chatbotSettings.findFirst({
    where: { userId: user.id, active: true },
  });

  if (activeSettings) {
    await db.chatbotSettings.update({
      where: { id: activeSettings.id },
      data: { active: false },
    });
  }

  // const newSettings = await db.chatbotSettings.create({
  //   data: { userId:user.id,prompt,leadInfo },
  // });

  let newSettings;
  if (!id)
    newSettings = await db.chatbotSettings.create({
      data: { userId: user.id, prompt, leadInfo },
    });
  else
    newSettings = await db.chatbotSettings.update({
      where: { id },
      data: { prompt, leadInfo },
    });

  return { success: newSettings };
};
