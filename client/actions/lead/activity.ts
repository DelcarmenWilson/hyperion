import { db } from "@/lib/db";

// DATA
export const leadActivitiesGet = async (leadId: string) => {
  try {
    const activities = await db.activity.findMany({  where: {
      leadId,
    },orderBy:{createdAt:"desc"}});
    return activities;
  } catch {
    return [];
  }
};

//ACTIONS
export const leadActivityInsert = async (
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
