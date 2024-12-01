"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { leadActivityInsert } from "@/actions/lead/activity";
import { getAssitantForUser } from "@/actions/user";

// LEADSTATUS

//DATA
export const leadStatusGetAllDefault = async () => {
  try {
    const userId = await getAssitantForUser();
    if (!userId) return [];

    const leadStatuses = await db.leadStatus.findMany({
      where: { OR: [{ userId }, { type: { equals: "default" } }],hidden:false },
    });
    return leadStatuses;
  } catch {
    return [];
  }
};

export const leadStatusGetAll = async () => {
  try {
    const userId = await getAssitantForUser();
    if (!userId) return [];

    const leadStatuses = await db.leadStatus.findMany({
      where: { userId },
    });
    return leadStatuses;
  } catch {
    return [];
  }
};
//ACTIONS

export const leadUpdateByIdStatus = async ({
  leadId,
  statusId,
}: {
  leadId: string;
  statusId: string;
}) => {
  const userId = await getAssitantForUser();
  if (!userId) return { error: "Unauthenticated" };

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) {
    return { error: "Lead does not exist" };
  }

  if (userId != existingLead.userId) {
    return { error: "Unauthorized" };
  }

  const lead=await db.lead.update({
    where: { id: leadId },
    data: {
      statusId,
    },
  });

  const leadStatus = await db.leadStatus.findUnique({
    where: { id: existingLead.statusId },
    select: { status: true },
  });

  leadActivityInsert(
    leadId,
    "status",
    "Status updated",
    userId,
    leadStatus?.status
  );
  return { success: lead };
};
