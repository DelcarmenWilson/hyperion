"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  PhoneSettingsSchema,
  PhoneSettingsSchemaType,
} from "@/schemas/phone-settings";

//DATA
export const phoneSettingsGet = async () => {
  //Get the phoneSettings for the user

  try {
    const user = await currentUser();
    if (!user) return null;

    const phoneSettings = await db.phoneSettings.findUnique({
      where: { userId: user.id },
    });

    return phoneSettings;
  } catch {
    return null;
  }
};

export const phoneSettingsInsert = async (userId: string) => {
  if (!userId) return { error: "userid was not supplied!" };
  await db.phoneSettings.create({
    data: {
      userId,
    },
  });
};

export const phoneSettingsUpdate = async (values: PhoneSettingsSchemaType) => {
  const validatedFields = PhoneSettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    userId,
    personalNumber,
    incoming,
    outgoing,
    dtmfPack,
    messageNotification,
    messageInternalNotification,
  } = validatedFields.data;

  const phoneSettings = await db.phoneSettings.update({
    where: { userId: userId },
    data: {
      personalNumber,
      incoming,
      outgoing,
      dtmfPack,
      messageNotification,
      messageInternalNotification,
    },
  });

  if (!phoneSettings) return { error: "Something went wrong!" };

  return { success: "Phone settings have been updated" };
};

export const phoneSettingsUpdateVoicemail = async (voicemailIn: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthorized!" };

  const phoneSettings = await db.phoneSettings.update({
    where: { userId: user.id },
    data: {
      voicemailIn,
    },
  });

  if (!phoneSettings) {
    return { error: "Something went wrong!" };
  }

  return { success: "Recording has been updated" };
};

export const phoneSettingsUpdateCurrentCall = async (currentCall: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated" };

  await db.phoneSettings.update({
    where: { userId: user.id },
    data: {
      currentCall,
    },
  });

  return { success: "current Call has been updated" };
};

export const phoneSettingsUpdateRemoveCurrentCall = async () => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated" };

  await db.phoneSettings.update({
    where: { userId: user.id },
    data: {
      currentCall: null,
    },
  });

  return { success: "current Call has been updated" };
};
