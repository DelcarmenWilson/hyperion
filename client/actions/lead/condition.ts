"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { LeadConditionSchema, LeadConditionSchemaType } from "@/schemas/lead";

import { createLeadActivity } from "@/actions/lead/activity";
import { LeadActivityType } from "@/types/lead";

//LEAD MEDICAL CONDITIONS
//DATA
export const getLeadConditions = async (leadId: string) => {
  return await db.leadMedicalCondition.findMany({
    where: {
      leadId,
    },
    include: { condition: true },
  });
};

export const getLeadCondition = async (id: string) => {
  return await db.leadMedicalCondition.findUnique({
    where: {
      id,
    },
    include: { condition: true },
  });
};
//ACTIONS
export const createLeadCondition = async (values: LeadConditionSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = LeadConditionSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!" );
  
  const { leadId, conditionId } = data;

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) throw new Error("Lead does not exists");

  const existingCondition = await db.leadMedicalCondition.findFirst({
    where: { leadId, conditionId },
  });
  if (existingCondition) throw new Error("Lead condition already exists");

  const newLeadCondition = await db.leadMedicalCondition.create({
    data: { ...data },
    include: { condition: true },
  });

  await createLeadActivity({
    leadId,
    type: LeadActivityType.CONDITION,
    activity: "Condition created",
    userId: user.id,
    newValue: newLeadCondition.condition.name,
  });
  return newLeadCondition;
};

export const updateLeadCondition = async (values: LeadConditionSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = LeadConditionSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const existingCondition = await db.leadMedicalCondition.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!existingCondition) throw new Error("Condition does not exists!");

  const modifiedCondition = await db.leadMedicalCondition.update({
    where: { id: existingCondition.id },
    data: {
      ...data,
    },
    include: { condition: true },
  });
  return modifiedCondition;
};

export const deleteLeadCondition = async (id: string) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const existingCondition = await db.leadMedicalCondition.findUnique({
    where: { id },
  });
  if (!existingCondition) throw new Error("Condition no longer exists" );
  

  await db.leadMedicalCondition.delete({
    where: { id },
  });

  await createLeadActivity({
    leadId:existingCondition.leadId,
    type: LeadActivityType.CONDITION,
    activity: "Condition deleted",
    userId: user.id,
  });
 
  return   "Condition deleted!" ;
};
