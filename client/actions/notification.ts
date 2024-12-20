"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendSocketData } from "@/services/socket-service";
import { DateRange } from "react-day-picker";

// DATA
export const getNotifications = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");
  return await db.notification.findMany({ where: { id, userId: user.id } });
};

export const getNotification = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");
  return await db.notification.findUnique({
    where: { id, userId: user.id },
  });
};
export const getFilteredNotifications = async (dateRange: DateRange) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated!");
  const notifications = await db.notification.findMany({
    where: {
      userId: user.id,
      createdAt: { lte: dateRange.to, gte: dateRange.from },
    },
    orderBy: { createdAt: "desc" },
  });
  return notifications;
};

export const getUnreadNotifications = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");
  return await db.notification.findMany({
    where: { userId: user.id, read: false },
  });
};
export const getMultipledNotifications = async (
  notificationIds: string[] | undefined
) => {
  if (!notificationIds) return null;
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");
  
  return await db.notification.findMany({
    where: { userId: user.id, id: { in: notificationIds } },
  });
};

// ACTIONS
export const createNotification = async (values: {
  reference: string;
  title: string;
  content: string;
  linkText: string | undefined;
  link: string | undefined;
  userId: string;
  read: boolean;
}) => {
  const notification = await db.notification.create({
    data: {
      ...values,
    },
  });
  if (!values.read)
    sendSocketData(values.userId, "notification:new", notification.id);
  revalidatePath("/notifications");
};

export const updateNotification = async (values: {
  id: string;
  reference: string;
  content: string;
  linkText: string | undefined;
  link: string | undefined;
}) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthenticated");

  await db.notification.update({
    where: { id: values.id },
    data: {
      ...values,
    },
  });

  revalidatePath("/notifications");
};

export const updateExitingNotification = async (values: {
  id: string;
  content: string;
  link: string | undefined;
}) => {
  const notification=await db.notification.update({
    where: { id: values.id },
    data: {
      ...values,
    },
  });

  sendSocketData(notification.userId, "notification:new", notification.id);
  revalidatePath("/notifications");
};

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
  } else {
    await db.notification.update({
      where: { id, userId: user.id },
      data: { read: true },
    });
  }

  return id;
};
