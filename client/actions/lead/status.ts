"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { UserRole } from "@prisma/client";

import { userGetByAssistant } from "@/data/user";
import { leadActivityInsert } from "@/actions/lead/activity";

// LEADSTATUS

//DATA
export const leadStatusGetAllDefault = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    let userId = user.id;
    if (user.role == "ASSISTANT")
      userId = (await userGetByAssistant(user.id)) as string;

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
    const user = await currentUser();
    if (!user) return [];

    let userId = user.id;
    if (user.role == "ASSISTANT")
      userId = (await userGetByAssistant(user.id)) as string;

    const leadStatuses = await db.leadStatus.findMany({
      where: { userId },
    });
    return leadStatuses;
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
  leadActivityInsert(
    leadId,
    "status",
    "Status updated",
    user.id,
    existingLead.status
  );
  return { success: "Lead status has been updated" };
};
