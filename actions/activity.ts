import { db } from "@/lib/db";

export const activityInsert = async (
  leadId: string,
  type: string,
  activity: string,
  userId?: string,
  newValue?: string
) => {
  await db.activity.create({
    data: {
      type,
      activity,
      leadId,
      userId,
      newValue,
    },
  });
  return { success: "Activity created" };
};
