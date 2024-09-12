"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { LeadConditionSchema, LeadConditionSchemaType } from "@/schemas/lead";

import { leadActivityInsert } from "@/actions/lead/activity";

//LEAD MEDICAL CONDITIONS
//DATA
export const leadConditionsGetAllById = async (leadId: string) => {
  try {
    const conditions = await db.leadMedicalCondition.findMany({
      where: {
        leadId,
      },
      include: { condition: true },
    });
    return conditions;
  } catch {
    return [];
  }
};
export const leadConditionGetById = async (id: string) => {
  try {
    const condition = await db.leadMedicalCondition.findUnique({
      where: {
        id,
      },
      include: { condition: true },
    });
    return condition;
  } catch {
    return null;
  }
};
//ACTIONS
export const leadConditionInsert = async (values: LeadConditionSchemaType) => {
  const validatedFields = LeadConditionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { leadId, conditionId, diagnosed, medications, notes } =
    validatedFields.data;

  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingLead = await db.lead.findUnique({ where: { id: leadId } });
  if (!existingLead) {
    return { error: "Lead does not exists" };
  }

  const existingCondition = await db.leadMedicalCondition.findFirst({
    where: { leadId: conditionId },
  });
  if (existingCondition) {
    return { error: "Lead condition already exists" };
  }

  const newLeadCondition = await db.leadMedicalCondition.create({
    data: { leadId, conditionId, diagnosed, medications, notes },
    include: { condition: true },
  });
  await leadActivityInsert(
    leadId,
    "Condition",
    "Condition created",
    user.id,
    newLeadCondition.condition.name
  );
  return { success: newLeadCondition };
};

export const leadConditionUpdateById = async (
  values: LeadConditionSchemaType
) => {
  const validatedFields = LeadConditionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { id, conditionId, diagnosed, medications, notes } =
    validatedFields.data;

  const existingCondition = await db.leadMedicalCondition.findUnique({
    where: {
      id,
    },
  });

  if (!existingCondition) {
    return { error: "Condition does not exists!" };
  }

  const modifiedCondition = await db.leadMedicalCondition.update({
    where: { id },
    data: {
      conditionId,
      diagnosed,
      medications,
      notes,
    },
    include: { condition: true },
  });
  return { success: modifiedCondition };
};

export const leadConditionDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unathenticated" };
  }

  const existingCondition = await db.leadMedicalCondition.findUnique({
    where: { id },
  });
  if (!existingCondition) {
    return { error: "Condition no longer exists" };
  }

  await db.leadMedicalCondition.delete({
    where: { id },
  });
  await leadActivityInsert(
    existingCondition.leadId,
    "Condition",
    "Condition deleted",
    user.id
  );
  return { success: "Condition deleted!" };
};
