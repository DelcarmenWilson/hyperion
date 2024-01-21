"use server";

import { db } from "@/lib/db";
import { defaultMessage, defaultPrompt } from "@/placeholder/chat";
import { User } from "@prisma/client";

export const chatSettingsInsert = async (user: User) => {
  const prompt = defaultPrompt().replace(
    "{AGENT_NAME}",
    user.name as string
  );
  const message = defaultMessage().replace(
    "{AGENT_NAME}",
    user.name as string
  );

  await db.chatSettings.create({
    data: {
      userId: user.id,
      defaultPrompt:prompt,
      defaultMessage:message,
      defaultFunction:""      
    },
  });
};

export const chatSettingsUpdate = async (values: any) => {
  const { userId, defaultPrompt, defaultMessage,defaultFunction,leadInfo } = values;
  const chatSettings = await db.chatSettings.update({
    where: { userId: userId },
    data: {
      defaultPrompt,
      defaultMessage,
      defaultFunction,
      leadInfo
    },
  });

  if (!chatSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Chat settings have been updated" };
};
