"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import {
  UpdateFeedbackSchema,
  UpdateFeedbackSchemaType,
} from "@/schemas/feedback";

export const updateFeedback = async (values: UpdateFeedbackSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  const { success, data } = UpdateFeedbackSchema.safeParse(values);

  if (!success) throw new Error("Invalid form data");

  const feedback = await db.feedback.update({
    where: { id: data.id, userId: user.id },
    data: {
      ...data,
    },
  });

  revalidatePath(`/feedback/${feedback.id}`);
};
