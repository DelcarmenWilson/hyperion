"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteMiniJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const result = await db.miniJob.delete({ where: { id } });

  const newMiniJob = await db.miniJob.findFirst({
    where: { jobId: result.jobId },
  });
  const url = "/admin/jobs";

  revalidatePath(`${url}/${result.jobId}`);
  if (newMiniJob) redirect(`${url}/${result.jobId}/${newMiniJob.id}`);
  redirect(`${url}/${result.jobId}`);
};
