"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const deleteJob = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!" };
  if (user.role != "DEVELOPER") return { error: "Unauthorized!" };

  const exisitingJob = await db.job.findUnique({
    where: { id },
    include: { miniJobs: true, feedbacks: true },
  });

  if (!exisitingJob) return { error: "Job does not exisits!" };
  if (exisitingJob.miniJobs.length > 0)
    return { error: "Please delete all the miniJobs first!" };
  if (exisitingJob.feedbacks.length > 0)
    return { error: "Please detach all the feedbacks first!" };

  await db.job.delete({ where: { id } });
  revalidatePath("/admin/jobs");
};
