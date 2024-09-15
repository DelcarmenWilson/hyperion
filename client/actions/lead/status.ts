"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { leadActivityInsert } from "@/actions/lead/activity";
import { userGetByAssistant } from "@/actions/user";

// LEADSTATUS

//DATA
export const leadStatusGetAllDefault = async () => {
  try {
    const userId = await userGetByAssistant();
    if(!userId) return[]

    const leadStatuses = await db.leadStatus.findMany({
      where: { OR: [{ userId }, { type: { equals: "default" } }] },
    });
    return leadStatuses;
  } catch {
    return [];
  }
};

export const leadStatusGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if(!userId) return[]

    const leadStatuses = await db.leadStatus.findMany({
      where: { userId },
    });
    return leadStatuses;
  } catch {
    return [];
  }
};
//ACTIONS

export const leadUpdateByIdStatus = async ({leadId, status}:{leadId: string, status: string}) => {
  const userId = await userGetByAssistant();
  if(!userId) return{ error: "Unauthenticated" }
   
  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (userId != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  await db.lead.update({
    where: { id: leadId },
    data: {
      status,
    },
  });
  leadActivityInsert(
    leadId,
    "status",
    "Status updated",
    userId,
    existingLead.status
  );
  return { success: "Lead status has been updated" };
};
