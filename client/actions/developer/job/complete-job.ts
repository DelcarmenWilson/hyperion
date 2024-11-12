"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";

export const completeJob = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const updatedJob = await db.job.update({
    where: { id },
    data: {
      completedAt: new Date(),
    },
  });

  return { success: updatedJob };
};
