"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  AgentWorkInfoSchema,
  AgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { weekStartEnd } from "@/formulas/dates";
import { getDay, getWeek } from "date-fns";
import { date } from "zod";

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

  const weeklyTarget = calculateWeeklyBluePrint(annualTarget).find(
    (e) => e.type == targetType
  );

  const week = weekStartEnd();
  const currentWeek = 52 - getWeek(new Date());

  const insertedBlueprint = await db.bluePrint.create({
    data: {
      callsTarget: weeklyTarget?.calls || 0,
      appointmentsTarget: weeklyTarget?.appointments || 0,
      premiumTarget: weeklyTarget?.premium || 0,
      userId: user.id,

      weeks: currentWeek,
      endAt: new Date(new Date().getFullYear(), 11, 31),
    },
  });
  if (!weeklyTarget) return { error: "" };
  const currDay = 7 - getDay(new Date()) + 1;
  await db.bluePrintWeek.create({
    data: {
      bluePrintId: insertedBlueprint.id,
      weekNumber: 1,
      callsTarget: (weeklyTarget.calls / 7) * currDay || 0,
      appointmentsTarget: (weeklyTarget.appointments / 7) * currDay || 0,
      premiumTarget: (weeklyTarget.premium / 7) * currDay || 0,
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
