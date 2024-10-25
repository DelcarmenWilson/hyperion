"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";

import {
  NotificationSettingsSchema,
  NotificationSettingsSchemaType,
} from "@/schemas/settings";
import { reFormatPhoneNumber } from "@/formulas/phones";

//DATA
export const notificationSettingsGet = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return null;
    }
    const notificationSettings = await db.notificationSettings.findUnique({
      where: {
        userId: user.id,
      },
    });
    return notificationSettings;
  } catch {
    return null;
  }
};
//ACTIONS
export const notificationSettingsInsert = async (userId: string) => {
  const existingSettings = await db.notificationSettings.findUnique({
    where: { userId },
  });

  if (existingSettings) {
    return { error: "Settings already exist!" };
  }

  const notificationSettings = await db.notificationSettings.create({
    data: {
      userId,
    },
  });

  return { success: notificationSettings };
};

export const notificationSettingsUpdate = async (
  values: NotificationSettingsSchemaType
) => {
  const validatedFields = NotificationSettingsSchema.safeParse(values);

  if (!validatedFields.success) 
    return { error: "Invalid fields!" };
  

  const { userId, calls, appointments, messages, voicemails, textForward,updates,blueprint } =
    validatedFields.data;

  if (!userId) return { error: "No User Id!" };

  await db.notificationSettings.update({
    where: { userId },
    data: {
      calls,
      appointments,
      messages,
      voicemails,
      textForward,updates,blueprint 
    },
  });

  return {
    success: "Notifications Settings Updated!",
  };
};

export const notificationsUpdateByIdMasterSwitch = async (value: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Auauthenticated" };
  }
  await db.notificationSettings.update({
    where: { userId: user.id },
    data: {
      masterSwitch: value,
    },
  });

  return { success: "Master switch has been updated" };
};
