"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  BluePrintSchema,
  BluePrintSchemaType,
  FullTimeInfoSchema,
  FullTimeInfoSchemaType,
} from "@/schemas/blueprint";
import { error } from "console";
import Sync from "twilio/lib/rest/Sync";

//DATA
export const bluePrintsGetAllByUserId = async () => {
  const user = await currentUser();
  if (!user) return [];

  const bluePrints = await db.bluePrint.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return bluePrints;
};

// DATA OF ACTIVE BLUEPRINT

export const bluePrintActive = async () => {
  const user = await currentUser();
  if (!user) return null;
  const blueprint = await db.bluePrint.findFirst({
    where: { userId: user.id, active: true },
  });

  return blueprint;
};

// DATA OF FULLTIME INFO
export const fullTimeInfoGetByUserId = async () => {
  const user = await currentUser();
  if (!user) return null;
  const fullTimeInfo = await db.fullTimeInfo.findUnique({
    where: { userId: user.id },
  });
  return fullTimeInfo;
};

//ACTIONS

export const bluePrintInsert = async (values: BluePrintSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = BluePrintSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { plannedTarget, type, period } = validatedFields.data;

  await db.bluePrint.updateMany({
    where: { active: true },
    data: { active: false },
  });

  const newBluePrint = await db.bluePrint.create({
    data: {
      plannedTarget,
      type,
      period,
      userId: user.id,
      endDate: new Date(),
      actualTarget: 0,
    },
  });

  return { success: newBluePrint };
};

//ACTIONS FOR FULLTIMEINFO
export const fullTimeInfoInsert = async (values: FullTimeInfoSchemaType) => {
  const user = await currentUser();
  if (!user) return { error: "Unathenticated" };

  const validatedFields = FullTimeInfoSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { workType, workingDays, workingHours, annualTarget } =
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
