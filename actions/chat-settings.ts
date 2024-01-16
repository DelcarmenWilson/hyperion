"use server";

import { db } from "@/lib/db";
import { defaultMessage, defaultPrompt } from "@/placeholder/chat";
import { User } from "@prisma/client";

export const ChatSettingsInsert = async (user: User) => {
  const initialPrompt = defaultPrompt().replace(
    "{AGENT_NAME}",
    user.name as string
  );
  const initialMessage = defaultMessage().replace(
    "{AGENT_NAME}",
    user.name as string
  );

  await db.chatSettings.create({
    data: {
      userId: user.id,
      initialPrompt,
      initialMessage,
    },
  });
};

export const ChatSettingsUpdate = async (values: any) => {
  const { userId, initialPrompt, initialMessage,leadInfo } = values;

  console.log(values);
  const chatSettings = await db.chatSettings.update({
    where: { userId: userId },
    data: {
      initialPrompt,
      initialMessage,
      leadInfo
    },
  });

  if (!chatSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Chat settings have been updated" };
};
