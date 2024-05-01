"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { DevFeedbackSchema, FeedbackSchema } from "@/schemas";

export const feedbackDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated!" };
  }

  await db.feedback.delete({ where: { id } });

  return { success: "Feedback has been deleted" };
};
export const feedbackInsert = async (
  values: z.infer<typeof FeedbackSchema>
) => {
  const validatedFields = FeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();

  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated!" };
  }

  const { headLine, page, feedback } = validatedFields.data;

  const newFeedback = await db.feedback.create({
    data: {
      userId: user.id,
      headLine,
      page,
      feedback,
    },
  });

  return { success: newFeedback.id };
};

export const feedbackUpdateById = async (
  values: z.infer<typeof FeedbackSchema>
) => {
  const validatedFields = FeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const { id, userId, headLine, page, feedback } = validatedFields.data;

  if (user?.id != userId) {
    return { error: "Unauthorized!" };
  }

  await db.feedback.update({
    where: { id },
    data: {
      userId,
      headLine,
      page,
      feedback,
    },
  });

  return { success: "Feedback has been updated" };
};

export const feedbackUpdateByIdDev = async (
  values: z.infer<typeof DevFeedbackSchema>
) => {
  const validatedFields = DevFeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated!" };
  }

  const { id, status, comments } = validatedFields.data;

  if (user?.role != "MASTER") {
    return { error: "Unauthorized!" };
  }

  await db.feedback.update({
    where: { id },
    data: {
      status,
      comments,
    },
  });

  return { success: "Feedback comment has been created" };
};
