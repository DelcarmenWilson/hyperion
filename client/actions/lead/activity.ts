"use server";
import { db } from "@/lib/db";

// DATA
export const getLeadActivities = async (leadId: string) => {
  return await db.leadActivity.findMany({
    where: {
      leadId,
    },
    orderBy: { createdAt: "desc" },
  });
};

//ACTIONS
export const createLeadActivity = async (data: {
  leadId: string;
  type: string;
  activity: string;
  userId?: string;
  newValue?: string;
}) => {
  await db.leadActivity.create({
    data: {
      ...data,
    },
  });
  return  "Activity created";
};
