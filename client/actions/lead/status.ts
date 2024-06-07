"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { UserRole } from "@prisma/client";

import { userGetByAssistant } from "@/data/user";
import { activityInsert } from "@/actions/activity";

// LEADSTATUS

//DATA
export const leadStatusGetAllByAgentIdDefault = async (userId: string) => {
  try {
    const temp = (await userGetByAssistant(userId)) as string;
    if (temp) userId = temp;

    const leadStatus = await db.leadStatus.findMany({
      where: { OR: [{ userId }, { type: { equals: "default" } }] },
    });
    return leadStatus;
  } catch {
    return [];
  }
};

export const leadStatusGetAllByAgentId = async (
  userId: string,
  role: UserRole = "USER"
) => {
  try {
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const leadStatus = await db.leadStatus.findMany({
      where: { userId },
    });
    return leadStatus;
  } catch {
    return [];
  }
};
//ACTIONS
export const leadUpdateByIdStatus = async (leadId: string, status: string) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated" };
  }

  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }
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
  activityInsert(
    leadId,
    "status",
    "Status updated",
    user.id,
    existingLead.status
  );
  return { success: "Lead status has been updated" };
};
