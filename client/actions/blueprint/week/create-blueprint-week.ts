"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import {
  CreateBluePrintSchema,
  CreateBluePrintSchemaType,
} from "@/schemas/blueprint";
import { weekStartEnd } from "@/formulas/dates";

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
