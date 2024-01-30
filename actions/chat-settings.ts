"use server";

import { replacePresetUser } from "@/formulas/text";
import { db } from "@/lib/db";
import { defaultChat } from "@/placeholder/chat";
import { User } from "@prisma/client";

export const chatSettingsInsert = async (user: User) => {
  const prompt = replacePresetUser(defaultChat.prompt,user.firstName);

  await db.chatSettings.create({
    data: {
      userId: user.id,
      defaultPrompt:prompt,
      defaultFunction:""      
    },
  });
};

export const chatSettingsUpdate = async (values: any) => {
  const { userId, defaultPrompt,defaultFunction,leadInfo } = values;
  const chatSettings = await db.chatSettings.update({
    where: { userId: userId },
    data: {
      defaultPrompt,
      defaultFunction,
      leadInfo
    },
  });

  if (!chatSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Chat settings have been updated" };
};
