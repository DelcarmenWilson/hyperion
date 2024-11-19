"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getUnreadNotifications = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");

  return db.notification.findMany({ where: { userId:user.id, read:false  } });
};
