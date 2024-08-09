"use server";
import { calculateWeeklyBluePrint } from "@/constants/blue-print";
import { weekStartEnd } from "@/formulas/dates";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  FullTimeInfoSchema,
  FullTimeInfoSchemaType,
} from "@/schemas/blueprint";

// DATA OF FULLTIME INFO
export const fullTimeInfoGetByUserId = async () => {
  const user = await currentUser();
  if (!user) return null;
  const fullTimeInfo = await db.fullTimeInfo.findUnique({
    where: { userId: user.id },
  });
  return fullTimeInfo;
};

//ACTIONS FOR FULLTIMEINFO
export const fullTimeInfoInsert = async (values: FullTimeInfoSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = FullTimeInfoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { workType, workingDays, workingHours, annualTarget, targetType } =
    validatedFields.data;
  const fullTimeInfoOld = await db.fullTimeInfo.findUnique({
    where: { userId: user.id },
  });
  if (fullTimeInfoOld) return { error: "FullTime details already exists" };

  const newFullTimeInfo = await db.fullTimeInfo.create({
    data: {
      userId: user.id,
      workType,
      workingDays,
      workingHours,
      annualTarget,
      targetType,
    },
  });

  const target = calculateWeeklyBluePrint(annualTarget).find(
    (e) => e.type == targetType
  );

  await db.bluePrint.create({
    data: {
      callsTarget: target?.calls || 0,
      appointmentsTarget: target?.appointments || 0,
      premiumTarget: target?.premium || 0,
      userId: user.id,
      endDate: weekStartEnd().to,
    },
  });

  return { success: newFullTimeInfo };
};
export const fullTimeInfoUpdateByUserId = async (
  values: FullTimeInfoSchemaType
) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = FullTimeInfoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { workType, workingDays, workingHours } = validatedFields.data;
  const fullTimeInfoOld = await db.fullTimeInfo.findUnique({
    where: { userId: user.id },
  });
  if (!fullTimeInfoOld) return { error: "FullTime details not available" };

  const newFullTimeInfo = await db.fullTimeInfo.update({
    where: { userId: user.id },
    data: {
      workType,
      workingDays,
      workingHours,
    },
  });

  return { success: newFullTimeInfo };
};
