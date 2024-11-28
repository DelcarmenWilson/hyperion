"use server";
import { db } from "@/lib/db";

export const updateBluePrintWeekData = async (
  userId: string,
  type: "calls" | "appointments" | "premium",
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
      where:{id:bluePrintWeekActive.bluePrintId},
      data:{
        calls: { increment: type == "calls" ? 1 : 0 },
        appointments: { increment: type == "appointments" ? 1 : 0 },
        premium: { increment: type == "premium" ? 1 : 0 },
      }
    })
  ]) 


  
};
