"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getFeedbacksForUser = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("unauthenticated");
  return db.feedback.findMany({
    where: { userId: user.id },
  });
};
