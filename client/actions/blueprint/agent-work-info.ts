"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  AgentWorkInfoSchema,
  AgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { weekStartEnd } from "@/formulas/dates";

// DATA
export const agentWorkInfoGetByUserId = async () => {
  const user = await currentUser();
  if (!user) return null;
  const fullTimeInfo = await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
  return fullTimeInfo;
};

//ACTIONS 
export const agentWorkInfoInsert = async (values: AgentWorkInfoSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = AgentWorkInfoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { workType, workingDays, workingHours, annualTarget, targetType } =
    validatedFields.data;
  const agentWorkInfoOld = await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
  if (agentWorkInfoOld) return { error: "Work info details already exists!!" };

  const insertedAgentWorkInfo = await db.agentWorkInfo.create({
    data: {
      userId: user.id,
      workType,
      workingDays,
      workingHours,
      annualTarget,
      targetType,
    },
  });

  const target = calculateWeeklyBluePrint(annualTarget).find(
    (e) => e.type == targetType
  );

  const week = weekStartEnd();

  const insertedBlueprint=await db.bluePrint.create({
    data: {
      callsTarget: target?.calls || 0,
      appointmentsTarget: target?.appointments || 0,
      premiumTarget: target?.premium || 0,
      userId: user.id,
      //TODO - need to change this to take in the yearly end date and current Month start date
      startAt: week.from,
      endAt: week.to,
    },    
  });

  await db.bluePrintWeek.create({
    data: {
      bluePrintId:insertedBlueprint.id,
      weekNumber:1,
      callsTarget: target?.calls || 0,
      appointmentsTarget: target?.appointments || 0,
      premiumTarget: target?.premium || 0,

      startAt: week.from,
      endAt: week.to,
    },    
  });

  return { success: insertedAgentWorkInfo };
};
export const agentWorkInfoUpdateByUserId = async (
  values: AgentWorkInfoSchemaType
) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = AgentWorkInfoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { workType, workingDays, workingHours } = validatedFields.data;
  const agentWorkInfoOld = await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
  if (!agentWorkInfoOld) return { error: "Work details not available" };

  const updateAgentWorkInfo = await db.agentWorkInfo.update({
    where: { userId: user.id },
    data: {
      workType,
      workingDays,
      workingHours,
    },
  });

  return { success: updateAgentWorkInfo };
};
