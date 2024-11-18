"use server";
import { db } from "@/lib/db";

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
    const endDate=new Date()
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