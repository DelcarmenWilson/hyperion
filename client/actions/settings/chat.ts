"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { User } from "@prisma/client";

import { defaultChat } from "@/placeholder/chat";
import { replacePresetUser } from "@/formulas/text";
import {
  ChatSettingsSchema,
  ChatSettingsSchemaType,
} from "@/schemas/chat-settings";

//DATA
export const chatSettingsGet = async () => {
  try {
    const user=await currentUser()
    if(!user)return null
    const chatsetting = await db.chatSettings.findUnique({
      where: { userId: user.id },include:{user:true}
    });
    return chatsetting;
  } catch {
    return null;
  }
};
export const chatSettingGetTitan = async (userId: string) => {
  //Get the chatsettings for the user
  const chatSettings = await db.chatSettings.findUnique({
    where: { userId },
  });
  if (!chatSettings) return false;
  return chatSettings.titan;
};

export const chatSettingsInsert = async (user: User) => {
  const prompt = replacePresetUser(defaultChat.prompt, user);

  await db.chatSettings.create({
    data: {
      userId: user.id,
      defaultPrompt: prompt,
      defaultFunction: "",
    },
  });
};

export const chatSettingsUpdate = async (values: ChatSettingsSchemaType) => {
  const validatedFields = ChatSettingsSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { userId, defaultPrompt, defaultFunction, titan, coach,online } =
    validatedFields.data;

  const chatSettings = await db.chatSettings.update({
    where: { userId: userId },
    data: {
      defaultPrompt,
      defaultFunction,
      titan,
      coach,
      online
    },
  });

  if (!chatSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Chat settings have been updated" };
};

export const chatSettingsUpdateCoach = async (coach: boolean) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  await db.chatSettings.update({
    where: { userId: user.id },
    data: {
      coach,
    },
  });

  return { success: `coaching has been turned ${coach ? "on" : "off"}` };
};

export const chatSettingsToggleOnline = async (online: boolean) => {
  const user = await currentUser();
  if (!user) 
    return { error: "Unauthenticated" };  

  await db.chatSettings.update({
    where: { userId: user.id },
    data: {
      online,
    },
  });
  return { success: `Show online users has been turned ${online ? "on" : "off"}` };
};