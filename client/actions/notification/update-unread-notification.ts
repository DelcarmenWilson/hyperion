"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const updateUnreadNotification = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthenticated");

  if (id == "clear") {
    await db.notification.updateMany({
      where: {
        userId: user.id,
        read: false,
      },
      data: { read: true },
    });
  } else     
    await db.notification.update({ where: { id,userId: user.id, }, data: { read: true } });
  
};
