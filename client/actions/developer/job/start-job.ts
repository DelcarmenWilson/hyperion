"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";
import { JobStatus } from "@/types/job";

export const startJob = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const updatedJob = await db.job.update({
    where: { id },
    data: {
      startedAt: new Date(),
      status:JobStatus.IN_PROGRESS
    },
  });

  return { success: updatedJob };
};
