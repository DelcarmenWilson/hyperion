"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { ScheduleSchema } from "@/schemas";

export const scheduleUpdateByUserId = async (
  values: z.infer<typeof ScheduleSchema>
) => {
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
