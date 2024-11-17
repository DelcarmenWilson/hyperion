"use server";
import { db } from "@/lib/db";

// SCHEDULE to hide deleted messages info after 1hour

export const hideDeletedMessages = async () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setHours(endDate.getHours() - 1);

  await db.chatMessage.updateMany({
    where: {
      NOT: { deletedBy: null },
      updatedAt: { lte: startDate, gte: endDate },
    },
    data: { hidden: true },
  });
};