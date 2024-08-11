"use server";
import { weekStartEnd } from "@/formulas/dates";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BluePrintSchema, BluePrintSchemaType } from "@/schemas/blueprint";

//DATA
export const bluePrintWeeksGetAllByUserId = async () => {
  const user = await currentUser();
  if (!user) return [];

  const bluePrintWeeks = await db.bluePrintWeek.findMany({
    where: { bluePrint: { userId: user.id } },
    orderBy: { createdAt: "desc" },
  });

  return bluePrintWeeks;
};

export const bluePrintWeekGetActive = async () => {
  const user = await currentUser();
  if (!user) return null;
  const bluePrintWeek = await db.bluePrintWeek.findFirst({
    where: { bluePrint: { userId: user.id }, active: true },
  });

  return bluePrintWeek;
};

//ACTIONS
export const bluePrintWeekInsert = async (values: BluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = BluePrintSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { callsTarget, appointmentsTarget, premiumTarget } =
    validatedFields.data;

  const bluePrintActive = await db.bluePrint.findFirst({
    where: { userId: user.id, active: true },
  });

  const bluePrintWeekActive = await db.bluePrintWeek.findFirst({
    where: { bluePrintId: bluePrintActive?.id, active: true },
  });

  if (!bluePrintWeekActive) return { error: "No weekly blueprint found!" };

  await db.bluePrintWeek.update({
    where: { id: bluePrintWeekActive.id },
    data: { active: false },
  });

  const week = weekStartEnd();

  const newBluePrint = await db.bluePrintWeek.create({
    data: {
      bluePrintId: bluePrintWeekActive.bluePrintId,
      weekNumber: bluePrintWeekActive.weekNumber + 1,
      callsTarget,
      appointmentsTarget,
      premiumTarget,
      startAt: week.from,
      endAt: week.to,
    },
  });

  return { success: newBluePrint };
};

export const bluePrintWeekUpdateByUserIdData = async (
  userId: string,
  type: "calls" | "appointments" | "premium",
  value?: number
) => {
  const bluePrintWeekActive = await db.bluePrintWeek.findFirst({
    where: { bluePrint: { userId }, active: true },
  });
  if (!bluePrintWeekActive)
    return { error: "bluePrint week does not exists!!" };

  await db.bluePrintWeek.update({
    where: { id: bluePrintWeekActive.id },
    data: {
      calls:
        type == "calls"
          ? bluePrintWeekActive.calls + 1
          : bluePrintWeekActive.calls,
      appointments:
        type == "appointments"
          ? bluePrintWeekActive.appointments + 1
          : bluePrintWeekActive.appointments,
      premium:
        type == "premium"
          ? bluePrintWeekActive.premium + value!
          : bluePrintWeekActive.premium,
    },
  });
  return { success: "BluePrint Week Updated!" };
};

export const calculateBlueprintTargets = async () => {
  const activeBluePrints = await db.bluePrint.findMany({
    where: { active: true },
  });

  if (!activeBluePrints) return { error: "No Active BluePrints" };
  for (const bp of activeBluePrints) {
    const activeWeek = await db.bluePrintWeek.findFirst({
      where: { bluePrint: { userId: bp.userId }, active: true },
    });

    if (!activeWeek) return { error: "no active week" };

    const weeksInYear = 52;
    // (Activeweektarget-activeweekactual)/(52-activeweeknumber)+Activeweektarget

    const newWeekCalls =
      (activeWeek.callsTarget - activeWeek.calls) /
        (weeksInYear - activeWeek.weekNumber) +
      activeWeek.callsTarget;

    const newWeekAppointments =
      (activeWeek.appointmentsTarget - activeWeek.appointments) /
        (weeksInYear - activeWeek.weekNumber) +
      activeWeek.appointmentsTarget;

    const newWeekPremium =
      (activeWeek.premiumTarget - activeWeek.premium) /
        (weeksInYear - activeWeek.weekNumber) +
      activeWeek.premiumTarget;

    // update current week as inactive

    await db.bluePrintWeek.update({
      where: { id: activeWeek.id },
      data: { active: false },
    });

    //create new week
    await db.bluePrintWeek.create({
      data: {
        bluePrintId: bp.id,
        callsTarget: newWeekCalls,
        appointmentsTarget: newWeekAppointments,
        premiumTarget: newWeekPremium,
        weekNumber: activeWeek.weekNumber + 1,
        //TODO -need to supply actual startdate and enddate
        startAt: new Date(),
        endAt: new Date(),
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
