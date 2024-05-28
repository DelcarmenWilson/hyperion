"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { DevFeedbackSchema,DevFeedbackSchemaType, FeedbackSchema, FeedbackSchemaType } from "@/schemas/feedback";

export const feedbackDeleteById = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated!" };
  }

  await db.feedback.delete({ where: { id } });

  return { success: "Feedback has been deleted" };
};
export const feedbackInsert = async (
  values: FeedbackSchemaType
) => {
  const user = await currentUser();

  if (!user?.id || !user?.email) {
    return { error: "Unauthenticated!" };
  }
  
  const validatedFields = FeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { headLine, page, feedback,images } = validatedFields.data;

  const newFeedback = await db.feedback.create({
    data: {
      userId: user.id,
      headLine,
      page,
      feedback,
      images
    },
  });

  return { success: newFeedback };
};

export const feedbackUpdateById = async (
  values: FeedbackSchemaType
) => {
  
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated!" };
  }
  const validatedFields = FeedbackSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, userId, headLine, page, feedback } = validatedFields.data;

  if (user?.id != userId) {
    return { error: "Unauthorized!" };
  }

  const updatedFeedback= await db.feedback.update({
    where: { id },
    data: {
      userId,
      headLine,
      page,
      feedback,
    },
  });

  return { success:updatedFeedback };
};

export const feedbackUpdateByIdDev = async (
  values: DevFeedbackSchemaType
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
