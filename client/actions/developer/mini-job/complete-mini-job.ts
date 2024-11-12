"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { JobStatus } from "@/types/job";
import { revalidatePath } from "next/cache";

export const completeMiniJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");
  const date = new Date();

  const miniJob = await db.miniJob.update({
    where: { id },
    data: {
      completedAt: date,
      status: JobStatus.COMPLETED,
    },
  });

  const pendingJobs = await db.miniJob.findMany({
    where: { jobId: miniJob.jobId, NOT: { status: JobStatus.COMPLETED } },
  });
  if (pendingJobs.length == 0) {
    await db.job.update({
      where: { id: miniJob.jobId },
      data: {
        completedAt: date,
        status: JobStatus.COMPLETED,
      },
    });
  }

  revalidatePath(`/admin/jobs/${miniJob.jobId}/${miniJob.id}`);
};
