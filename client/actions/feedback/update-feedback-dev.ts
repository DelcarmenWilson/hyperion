"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";

import { NotificationReference } from "@/types/notification";
import { FeedbackStatus } from "@/types/feedback";
import {
  UpdateDevFeedbackSchema,
  UpdateDevFeedbackSchemaType,
} from "@/schemas/feedback";
import { UserRole } from "@prisma/client";
import { DEVADMINS } from "@/constants/user";
import { createNotification } from "@/actions/notification";

export const updateFeedbackDev = async (
  values: UpdateDevFeedbackSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated form data");
  if (!DEVADMINS.includes(user?.role as UserRole))
    throw new Error("Unauthorized");

  const { success, data } = UpdateDevFeedbackSchema.safeParse(values);
  if (!success) throw new Error("Invalid form data");

  const feedback = await db.feedback.update({
    where: { id: data.id },
    data: {
      ...data,
      devId: user.id,
    },
  });

  if (data.status == FeedbackStatus.COMPLETED) {
    createNotification({
      reference: NotificationReference.FEEDBACK,
      title: "Feed back Completed",
      content: feedback.title,
      linkText: "View Feedback",
      link: `/admin/feedbacks/${feedback.id}`,
      userId: feedback.userId,
      read:false
    });
  }

  revalidatePath(`/admin/feedbacks/${data.id}`);
};
