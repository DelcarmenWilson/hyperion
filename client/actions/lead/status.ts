"use server";
import { db } from "@/lib/db";

import { createLeadActivity } from "@/actions/lead/activity";
import { getAssitantForUser } from "@/actions/user";
import { LeadActivityType } from "@/types/lead";

// LEADSTATUS
//DATA
export const getLleadStatusDefault = async () => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated!");

  return await db.leadStatus.findMany({
    where: {
      OR: [{ userId }, { type: { equals: "default" } }],
      hidden: false,
    },
  });
};

export const getLleadStatus = async () => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated!");

  return await db.leadStatus.findMany({
    where: { userId },
  });
};

//ACTIONS
export const updateLeadStatus = async ({
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

  const lead = await db.lead.update({
    where: { id: leadId },
    data: {
      statusId,
    },
  });

  const leadStatus = await db.leadStatus.findUnique({
    where: { id: existingLead.statusId },
    select: { status: true },
  });
  await createLeadActivity({
    leadId,
    type: LeadActivityType.STATUS,
    activity: "Status updated",
    userId,
    newValue: leadStatus?.status,
  });

  return { success: lead };
};
