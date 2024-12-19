"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  CreateAgentWorkInfoSchema,
  CreateAgentWorkInfoSchemaType,
  UpdateAgentWorkInfoSchema,
  UpdateAgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { weekStartEnd } from "@/formulas/dates";
import { getDay, getWeek } from "date-fns";

//DATA
export const getAgentWorkInfo = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
};

//ACTIONS
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

export const updateAgentWorkInfo = async (
  values: UpdateAgentWorkInfoSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = UpdateAgentWorkInfoSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!");

  const agentWorkInfoOld = await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });
  if (!agentWorkInfoOld) throw new Error("Work details not available!");
  //TODO -this needs to be added back see where the issue is coming from. we had changed the working days in the blue pring to use an array of numbers instead of days of the week
//   const updateAgentWorkInfo = await db.agentWorkInfo.update({
//     where: { userId: user.id },
//     data: {
//       ...data,
//     },
//   });

  revalidatePath("/blueprint");
};
