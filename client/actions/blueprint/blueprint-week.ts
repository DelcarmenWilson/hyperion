"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  BluePrintSchema,
  BluePrintSchemaType,
} from "@/schemas/blueprint";

//DATA
export const bluePrintWeeksGetAllByUserId = async () => {
  const user = await currentUser();
  if (!user) return [];

  const bluePrintWeeks = await db.bluePrintWeek.findMany({
    where: { bluePrint: {userId:user.id} },
    orderBy: { createdAt: "desc" },
  });

  return bluePrintWeeks;
};

// DATA OF ACTIVE BLUEPRINT

export const bluePrintWeekGetActive = async () => {
  const user = await currentUser();
  if (!user) return null;
  const bluePrintWeek = await db.bluePrintWeek.findFirst({
    where: { bluePrint: {userId:user.id}, active: true },
  });

  return bluePrintWeek;
};


//ACTIONS
export const bluePrintWeekInsert = async (values: BluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = BluePrintSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { callsTarget, appointmentsTarget, premiumTarget, period } =
    validatedFields.data;

  await db.bluePrint.updateMany({
    where: { active: true },
    data: { active: false },
  });

  const newBluePrint = await db.bluePrint.create({
    data: {
      callsTarget,
      appointmentsTarget,
      premiumTarget,
      userId: user.id,
      endDate: new Date(),
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
    where: { bluePrint: {userId} , active: true },
  });
  if (!bluePrintWeekActive) return { error: "bluePrint week does not exists!!" };

  await db.bluePrintWeek.update({
    where: { id: bluePrintWeekActive.id },
    data: {
      calls: type == "calls" ? bluePrintWeekActive.calls + 1 : bluePrintWeekActive.calls,
      appointments:
        type == "appointments"
          ? bluePrintWeekActive.appointments + 1
          : bluePrintWeekActive.appointments,
      premium:
        type == "premium" ? bluePrintWeekActive.premium + value! : bluePrintWeekActive.premium,
    },
  });
  return {success:"BluePrint Week Updated!"}
};

