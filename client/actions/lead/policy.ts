"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { LeadActivityType, LeadDefaultStatus } from "@/types/lead";
import { LeadPolicySchema, LeadPolicySchemaType } from "@/schemas/lead";

import { createLeadActivity } from "./activity";
import { updateBluePrintWeekData } from "@/actions/blueprint/week/update-blueprint-week-data";

//DATA
export const getLeadPolicy = async (leadId: string) => {
  return await db.leadPolicy.findUnique({
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
};

//ACTIONS
export const createOrUpdateLeadPolicy = async (values: LeadPolicySchemaType) => {
  const user = await currentUser();
  if (!user?.id || !user?.email) throw new Error("Unauthenticated!"); 

  const {success,data} = LeadPolicySchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!" );
  
  const { leadId, ap } = data;

  const existingLead = await db.lead.findUnique({ where: { id: leadId,userId:user.id } });

  if (!existingLead) throw new Error("Lead does not exist" );

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
    update: { ...data },
    create: {
      ...data,
    },
  });
//TODO - this seems like the more correct one. if the policy is updated we should update the current blue print with the difference in the changes prior and after the change
  // updateBluePrintWeekData(user.id, "premium", diff);
  updateBluePrintWeekData(user.id, "premium");

  await createLeadActivity({
    leadId,
    type: LeadActivityType.POLICY,
    activity: "policy info updated",
    userId: user.id,
  });
  
  return   leadPolicyInfo ;
};
