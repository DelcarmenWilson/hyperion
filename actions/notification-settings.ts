"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

import { NotificationSettingsSchema } from "@/schemas";
import { reFormatPhoneNumber } from "@/formulas/phones";

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
      phoneNumber: "",
    },
  });

  return { success: notificationSettings };
};

export const notificationSettingsUpdateByUserId = async (
  values: z.infer<typeof NotificationSettingsSchema>
) => {
  const validatedFields = NotificationSettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, phoneNumber, calls, appointments, messages, voicemails } =
    validatedFields.data;

  if (!userId) {
    return { error: "No User Id!" };
  }

   await db.notificationSettings.update({
    where: { userId },
    data: {
      phoneNumber:reFormatPhoneNumber(phoneNumber),
      calls,
      appointments,
      messages,
      voicemails,
    },
  });

  return { success: "Notifications Settings Updated!" };
};

//TODO - dont forget to remove this as it should only sun once
export const notificationSettingsInsertAll = async () => {
  const role = await currentRole();

  if (role != "MASTER") {
    return { error: "Unauthorized!" };
  }

  const notifications = await db.notificationSettings.findFirst();
  if (notifications) {
    return { error: "Notifications Settings already exist!" };
  }
  const users = await db.user.findMany({ select: { id: true } });

  if (!users) {
    return { error: "No Users found!" };
  }
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await notificationSettingsInsert(user.id);
  }

  return { success: "Notification Settings have been inserted" };
};
