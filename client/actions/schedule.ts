"use server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { ScheduleSchema, ScheduleSchemaType } from "@/schemas/settings";
import { userGetByAssistant } from "@/data/user";

//DATA
export const scheduleGetByUserId = async (
  userId: string | null | undefined,
  role: UserRole = "USER"
) => {
  try {
    if (!userId) return null;

    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const schedule = await db.schedule.findUnique({
      where: { userId },
    });
    return schedule;
  } catch {
    return null;
  }
};

export const scheduleInsert = async (values: ScheduleSchemaType) => {
  try {
    const validatedFields = ScheduleSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      userId,
      title,
      subTitle,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = validatedFields.data;

    await db.schedule.create({
      data: {
        userId,
        title,
        subTitle,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
      },
    });

    return { success: "schedule has been updated!" };
  } catch {
    return { error: "internal server error!" };
  }
};
export const scheduleUpdateByUserId = async (values: ScheduleSchemaType) => {
  try {
    const validatedFields = ScheduleSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      userId,
      type,
      title,
      subTitle,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = validatedFields.data;

    await db.schedule.update({
      where: { userId },
      data: {
        type,
        title,
        subTitle,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
      },
    });

    return { success: "schedule has been updated!" };
  } catch {
    return { error: "internal server error!" };
  }
};
