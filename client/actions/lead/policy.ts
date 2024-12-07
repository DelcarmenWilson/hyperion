"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { LeadDefaultStatus } from "@/types/lead";
import { LeadPolicySchema, LeadPolicySchemaType } from "@/schemas/lead";

import { leadActivityInsert } from "./activity";
import { updateBluePrintWeekData } from "@/actions/blueprint/week/update-blueprint-week-data";

//DATA
export const leadPolicyGet = async (leadId: string) => {
  try {
    const leadPolicy = await db.leadPolicy.findUnique({
      where: {
        leadId,
      },
      include: {
        carrier: { select: { name: true } },
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            assistant: true,
          },
        },
      },
    });
    return leadPolicy;
  } catch {
    return null;
  }
};

//ACTIONS
export const leadPolicyUpsert = async (values: LeadPolicySchemaType) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) return { error: "Unauthenticated" };

  const validatedFields = LeadPolicySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, ap } = validatedFields.data;

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });

  if (!existingLead) return { error: "Lead does not exist" };

  if (user.id != existingLead.userId) {
    return { error: "Unauthorized" };
  }
  let diff = parseInt(ap);
  if (diff > 0) {
    await db.lead.update({
      where: { id: leadId },
      data: {
        statusId: LeadDefaultStatus.SOLD,
        assistant: { disconnect: true },
      },
    });
  }
  const existingPolicy = await db.leadPolicy.findUnique({ where: { leadId } });
  if (existingPolicy) diff -= parseInt(existingPolicy.ap);

  const leadPolicyInfo = await db.leadPolicy.upsert({
    where: { leadId: leadId || "" },
    update: { ...validatedFields.data },
    create: {
      ...validatedFields.data,
    },
  });
//TODO - this seems like the more correct one. if the policy is updated we should update the current blue print with the difference in the changes prior and after the change
  // updateBluePrintWeekData(user.id, "premium", diff);
  updateBluePrintWeekData(user.id, "premium");
  leadActivityInsert(leadId, "sale", "policy info updated", user.id);
  return { success: leadPolicyInfo };
};
