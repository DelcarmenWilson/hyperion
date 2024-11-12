"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  CreateFeedbackSchema,
  CreateFeedbackSchemaType,
} from "@/schemas/feedback";
import { FeedbackStatus } from "@/types/feedback";

export const createFeedback = async (values: CreateFeedbackSchemaType) => {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");
  
    const { success, data } = CreateFeedbackSchema.safeParse(values);
  
    if (!success) throw new Error("Invalid form data");
  
    const feedback = await db.feedback.create({
      data: {
        userId: user.id,
        ...data,
        status: FeedbackStatus.PENDING,
      },
    });
    revalidatePath("/feedback");
    redirect(`/feedback/${feedback.id}`);
  };