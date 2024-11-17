"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";
import { JobStatus } from "@/types/job";
import { revalidatePath } from "next/cache";

export const startJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!" );

  const job = await db.job.update({
    where: { id },
    data: {
      startedAt: new Date(),
      status:JobStatus.IN_PROGRESS
    },
  });

  revalidatePath(`/admin/jobs/${job.id}`)
};
