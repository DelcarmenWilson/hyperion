"use server";

import { replacePresetUser } from "@/formulas/text";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { defaultChat } from "@/placeholder/chat";
import { User } from "@prisma/client";

export const chatSettingsInsert = async (user: User) => {
  const prompt = replacePresetUser(defaultChat.prompt, user.firstName);

  await db.chatSettings.create({
    data: {
      userId: user.id,
      defaultPrompt: prompt,
      defaultFunction: "",
    },
  });
};

export const chatSettingsUpdate = async (values: any) => {
  const {
    userId,
    defaultPrompt,
    defaultFunction,
    leadInfo,
    autoChat,
    record,
    coach,
  } = values;
  const chatSettings = await db.chatSettings.update({
    where: { userId: userId },
    data: {
      defaultPrompt,
      defaultFunction,
      leadInfo,
      autoChat,
      record,
      coach,
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

export const chatSettingsUpdateRecord = async (record: boolean) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  await db.chatSettings.update({
    where: { userId: user.id },
    data: {
      record,
    },
  });

  return { success: `recording has been turned ${record ? "on" : "off"}` };
};
