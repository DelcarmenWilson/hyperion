"use server";
import { db } from "@/lib/db";

export const updateBluePrintWeekData = async (
  userId: string,
  type: "calls" | "appointments" | "premium",
  value?: number
) => {
  const bluePrintWeekActive = await db.bluePrintWeek.findFirst({
    where: { bluePrint: { userId }, active: true },
  });
  if (!bluePrintWeekActive) throw new Error("bluePrint week does not exists!");

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
};