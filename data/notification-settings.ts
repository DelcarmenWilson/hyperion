import { db } from "@/lib/db";

export const notificationSettingsGetByUserId = async (userId: string) => {
  try {
    const notificationSettings = await db.notificationSettings.findUnique({
      where: {
        userId,
      },
    });
    return notificationSettings;
  } catch {
    return null;
  }
};
