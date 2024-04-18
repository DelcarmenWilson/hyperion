import { db } from "@/lib/db";

export const feedbacksGetAll = async () => {
  try {
    const feedbacks = await db.feedback.findMany({
      include: { user: true },
    });
    return feedbacks;
  } catch {
    return [];
  }
};
export const feedbacksGetAllByUserId = async (userId: string) => {
  try {
    const feedbacks = await db.feedback.findMany({
      where: { userId },
    });
    return feedbacks;
  } catch {
    return [];
  }
};
export const feedbackGetId = async (id: string) => {
  try {
    const feedback = await db.feedback.findUnique({
      where: { id },
      include: { user: true },
    });
    return feedback;
  } catch {
    return null;
  }
};
