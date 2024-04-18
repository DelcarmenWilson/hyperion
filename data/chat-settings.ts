import { db } from "@/lib/db";

export const chatSettingsGetById = async (id: string) => {
  try {
    const chatsetting = await db.chatSettings.findUnique({
      where: { userId: id },include:{user:true}
    });
    return chatsetting;
  } catch {
    return null;
  }
};