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

export const scheduleInsert = async (
  userId: string,
  firstName: string,
  hours: string
) => {
  await db.schedule.create({
    data: {
      userId,
      type: "",
      title: `Book an Appointment with ${firstName}`,
      subTitle:
        "Pick the time that best works for you. I am looking forward to connecting with you.",
      monday: hours,
      tuesday: hours,
      wednesday: hours,
      thursday: hours,
      friday: hours,
      saturday: "Not Available",
      sunday: "Not Available",
    },
  });

  return { success: "schedule has been created!" };
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