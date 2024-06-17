"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";

import {
  NotificationSettingsSchema,
  NotificationSettingsSchemaType,
} from "@/schemas/settings";
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
  values: NotificationSettingsSchemaType
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
const validPhoneNumber=reFormatPhoneNumber(phoneNumber)

  await db.notificationSettings.update({
    where: { userId },
    data: {
      phoneNumber: validPhoneNumber,
      calls,
      appointments,
      messages,
      voicemails,
    },
  });

  return { success: `Notifications Settings Updated! ${!validPhoneNumber?"Phone Number is not valid":""}` };
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
