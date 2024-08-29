"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  GptMessageSchema,
  GptMessageSchemaType,
  GptSettingsSchema,
  GptSettingsSchemaType,
} from "@/schemas/test";
import { chatFetch } from "./gpt";
import { error } from "console";
import { string } from "zod";

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

export const gptGetByUserIdActive = async () => {
  try {
    const user = await currentUser();
    if (!user?.email) {
      return null;
    }
    const settings = await db.gptSettings.findFirst({
      where: { userId: user.id, active: true },
    });
    return settings;
  } catch {
    return null;
  }
};
//ACTIONS
//CONVERSATION
export const gptConversationInsert = async () => {
  const user = await currentUser();
  if (!user?.email) {
    return { error: "Unathentiacted" };
  }

  const lastConvo = await db.gptConversation.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  
  if (lastConvo && !lastConvo.lastMessageId)
    return { error: "Last conversation is empty" };

  const conversation = await db.gptConversation.create({
    data: {
      userId: user.id,
    },
  });

  if (!conversation.id) {
    return { error: "Conversation was not created!" };
  }

  const settings = await gptGetByUserIdActive();

  if (settings) {
    await db.gptMessage.create({
      data: {
        content: settings.prompt,
        conversationId: conversation.id,
        role: "system",
      },
    });
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
//MESSAGE
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

//SETTINGS
export const gptSettingsInsert2 = async (values: GptSettingsSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = GptSettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { prompt, leadInfo } = validatedFields.data;

  const activeSettings = await db.gptSettings.findFirst({
    where: { userId: user.id, active: true },
  });

  if (activeSettings) {
    await db.gptSettings.update({
      where: { id: activeSettings.id },
      data: { active: false },
    });
  }

  const newSettings = await db.gptSettings.create({
    data: { userId: user.id, prompt, leadInfo },
  });

  return { success: newSettings };
};

export const gptSettingsUpsert = async (values: GptSettingsSchemaType) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = GptSettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, prompt, leadInfo } = validatedFields.data;

  const activeSettings = await db.gptSettings.findFirst({
    where: { userId: user.id, active: true },
  });

  if (activeSettings) {
    await db.gptSettings.update({
      where: { id: activeSettings.id },
      data: { active: false },
    });
  }

  // const newSettings = await db.gptSettings.create({
  //   data: { userId:user.id,prompt,leadInfo },
  // });

  let newSettings;
  if (!id)
    newSettings = await db.gptSettings.create({
      data: { userId: user.id, prompt, leadInfo },
    });
  else
    newSettings = await db.gptSettings.update({
      where: { id },
      data: { prompt, leadInfo },
    });

  return { success: newSettings };
};

export const gptSettingsInsert = async (values: GptSettingsSchemaType) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated" };

  const validated = GptSettingsSchema.safeParse(values);

  if (!validated.success) return { error: "Invalid Fields" };

  const { prompt, leadInfo } = validated.data;

  const newSettings= await db.gptSettings.create({
    data: {
      prompt,
      leadInfo,
      userId: user.id,
    },
  });
  return {success:newSettings}
};


