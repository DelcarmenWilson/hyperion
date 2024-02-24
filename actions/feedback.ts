"use server";

import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DevFeedbackSchema, FeedbackSchema } from "@/schemas";

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

  await db.feedback.create({
    data: {
      userId: user.id,
      headLine,
      page,
      feedback,
    },
  });

  return { success: "Feedback has been created" };
};


export const feedbackGetAll = async () => {
  try {
    const feedbacks = await db.feedback.findMany({
      include:{user:true},
    });
    return feedbacks;
  } catch {
    return [];
  }
};
export const feedbackGetId = async (id: string) => {
  try {
    const feedback = await db.feedback.findUnique({
      where: { id },include:{user:true},
    });
    return feedback;
  } catch {
    return null;
  }
};
export const feedbackGetAllByUserId = async (userId: string) => {
  try {
    const feedbacks = await db.feedback.findMany({
      where: { userId }
    });
    return feedbacks;
  } catch {
    return [];
  }
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

  const { id,userId,headLine, page, feedback } = validatedFields.data;
  
  if (user?.id != userId) {
    return { error: "Unauthorized!" };
  }

  await db.feedback.update({where:{id},
    data: {
      userId,
      headLine,
      page,
      feedback,
    },
  });

  return { success: "Feedback has been created" };
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

  const { id,status,comments } = validatedFields.data;
  
  if (user?.role != "MASTER") {
    return { error: "Unauthorized!" };
  }

  await db.feedback.update({where:{id},
    data: {
      status,comments
    },
  });

  return { success: "Feedback comment has been created" };
};