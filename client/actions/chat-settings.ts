"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { User } from "@prisma/client";

import { defaultChat } from "@/placeholder/chat";
import { replacePresetUser } from "@/formulas/text";

//DATA
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

//TODO need to create a type for this instead of any
export const chatSettingsUpdate = async (values: any) => {
  const {
    userId,
    defaultPrompt,
    defaultFunction,
    messageNotification,
    titan,
    coach,
  } = values;

  const chatSettings = await db.chatSettings.update({
    where: { userId: userId },
    data: {
      defaultPrompt,
      defaultFunction,
      messageNotification,
      titan,
      coach,
    },
  });

  if (!chatSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Chat settings have been updated" };
};

export const chatSettingsUpdateVoicemail = async (voicemailIn: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized!" };
  }

  const chatSettings = await db.chatSettings.update({
    where: { userId: user.id },
    data: {
      voicemailIn,
    },
  });

  if (!chatSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Recording has been updated" };
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

export const chatSettingsUpdateCurrentCall = async (currentCall: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  await db.chatSettings.update({
    where: { userId: user.id },
    data: {
      currentCall,
    },
  });

  return { success: "current Call has been updated" };
};

export const chatSettingsUpdateRemoveCurrentCall = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  await db.chatSettings.update({
    where: { userId: user.id },
    data: {
      currentCall: null,
    },
  });

  return { success: "current Call has been updated" };
};
