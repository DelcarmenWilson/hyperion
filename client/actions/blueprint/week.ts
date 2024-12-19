"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  CreateBluePrintSchema,
  CreateBluePrintSchemaType,
  UpdateBluePrintWeekSchema,
  UpdateBluePrintWeekSchemaType,
} from "@/schemas/blueprint";

import { weekStartEnd } from "@/formulas/dates";

//DATA
export const getBluePrintWeeks = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.bluePrintWeek.findMany({
    where: { bluePrint: { userId: user.id } },
    orderBy: { createdAt: "desc" },
  });
};
export const getActiveBluePrintWeek = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.bluePrintWeek.findFirst({
    where: { bluePrint: { userId: user.id }, active: true },
  });
};

export const getBluePrintWeeksReport = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.bluePrintWeek.findMany({
    where: { bluePrint: { userId: user.id } },
  });
};

//ACTIONS
export const createBluePrintWeek = async (
  values: CreateBluePrintSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = CreateBluePrintSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!");

  const bluePrintActive = await db.bluePrint.findFirst({
    where: { userId: user.id, active: true },
  });

  const bluePrintWeekActive = await db.bluePrintWeek.findFirst({
    where: { bluePrintId: bluePrintActive?.id, active: true },
  });

  if (!bluePrintWeekActive) throw new Error("No weekly blueprint found!");

  await db.bluePrintWeek.update({
    where: { id: bluePrintWeekActive.id },
    data: { active: false },
  });

  const week = weekStartEnd();

  const newBluePrint = await db.bluePrintWeek.create({
    data: {
      bluePrintId: bluePrintWeekActive.bluePrintId,
      weekNumber: bluePrintWeekActive.weekNumber + 1,
      ...data,
      //  todo-- provide actual end date
      endAt: week.to,
    },
  });

  return newBluePrint;
};

export const createNewBlueprintWeek = async () => {
  const activeBluePrints = await db.bluePrint.findMany({
    where: { active: true },
  });

  if (!activeBluePrints) throw new Error("No Active BluePrints!");
  for (const bp of activeBluePrints) {
    const activeWeek = await db.bluePrintWeek.findFirst({
      where: { bluePrint: { userId: bp.userId }, active: true },
    });

    if (!activeWeek) throw new Error("no active week!");

    const weeksInYear = 52;
    // (Activeweektarget-activeweekactual)/(52-activeweeknumber)+weeklytarget

    const newWeekCalls = Math.ceil(
      (activeWeek.callsTarget - activeWeek.calls) /
        (weeksInYear - activeWeek.weekNumber) +
        bp.callsTarget
    );

    const newWeekAppointments = Math.ceil(
      (activeWeek.appointmentsTarget - activeWeek.appointments) /
        (weeksInYear - activeWeek.weekNumber) +
        bp.appointmentsTarget
    );

    const newWeekPremium = Math.ceil(
      (activeWeek.premiumTarget - activeWeek.premium) /
        (weeksInYear - activeWeek.weekNumber) +
        bp.premiumTarget
    );
    // update current week as inactive

    await db.bluePrintWeek.update({
      where: { id: activeWeek.id },
      data: { active: false },
    });
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setSeconds(endDate.getSeconds() - 1);

    //create new week
    await db.bluePrintWeek.create({
      data: {
        bluePrintId: bp.id,
        callsTarget: newWeekCalls,
        appointmentsTarget: newWeekAppointments,
        premiumTarget: newWeekPremium,
        weekNumber: activeWeek.weekNumber + 1,
        //todo- end of the week
        endAt: endDate,
      },
    });
    // this to update actual blue print with current week data
    await db.bluePrint.update({
      where: { id: bp.id },
      data: {
        calls: bp.calls + activeWeek.calls,
        appointments: bp.appointments + activeWeek.appointments,
        premium: bp.premium + activeWeek.premium,
      },
    });
  }
};

export const updateBluePrintWeek = async (
  values: UpdateBluePrintWeekSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = UpdateBluePrintWeekSchema.safeParse(values);
  if (!success) throw new Error("Invalid Fields!");

  const bluePrintWeek = await db.bluePrintWeek.findUnique({
    where: { id: data.id },
  });

  if (!bluePrintWeek) throw new Error("No weekly blueprint found!");

  await db.$transaction([
    db.bluePrintWeek.update({
      where: { id: bluePrintWeek.id },
      data: { ...data },
    }),

    db.bluePrint.update({
      where: { id: bluePrintWeek.bluePrintId },
      data: {
        calls: { increment: data.calls },
        appointments: { increment: data.appointments },
        premium: { increment: data.premium },
      },
    }),
  ]);

  revalidatePath("/blueprint");
  revalidatePath("/");
};

export const updateBluePrintWeekData = async (
  userId: string,
  type: "calls" | "appointments" | "premium"
) => {
  const bluePrintWeekActive = await db.bluePrintWeek.findFirst({
    where: { bluePrint: { userId }, active: true },
  });
  if (!bluePrintWeekActive) throw new Error("bluePrint week does not exists!");

  await db.$transaction([
    db.bluePrintWeek.update({
      where: { id: bluePrintWeekActive.id },
      data: {
        calls: { increment: type == "calls" ? 1 : 0 },
        appointments: { increment: type == "appointments" ? 1 : 0 },
        premium: { increment: type == "premium" ? 1 : 0 },
      },
    }),

    db.bluePrint.update({
      where: { id: bluePrintWeekActive.bluePrintId },
      data: {
        calls: { increment: type == "calls" ? 1 : 0 },
        appointments: { increment: type == "appointments" ? 1 : 0 },
        premium: { increment: type == "premium" ? 1 : 0 },
      },
    }),
  ]);
};
