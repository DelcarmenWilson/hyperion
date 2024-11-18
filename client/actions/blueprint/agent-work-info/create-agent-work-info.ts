"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CreateAgentWorkInfoSchema,
  CreateAgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { weekStartEnd } from "@/formulas/dates";
import { getDay, getWeek } from "date-fns";

export const createAgentWorkInfo = async (
  values: CreateAgentWorkInfoSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = CreateAgentWorkInfoSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!");

  const agentWorkInfoOld = await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
  if (agentWorkInfoOld) throw new Error("Work info details already exists!!!");

  const insertedAgentWorkInfo = await db.agentWorkInfo.create({
    data: {
      userId: user.id,
      ...data,
    },
  });

  const weeklyTarget = calculateWeeklyBluePrint(data.annualTarget).find(
    (e) => e.type == data.targetType
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
