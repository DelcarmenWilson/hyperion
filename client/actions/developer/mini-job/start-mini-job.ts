"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { JobStatus } from "@/types/job";
import { revalidatePath } from "next/cache";


export const startMiniJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized");

  const date=new Date()

  const miniJob = await db.miniJob.update({
    where: { id },
    data: {
      startedAt: date,
      status:JobStatus.IN_PROGRESS
    },
  });

  const job=await db.job.findUnique({where:{id:miniJob.jobId,status:JobStatus.OPEN}})
  if(job){
    await db.job.update({where:{id:job.id},data:{
      startedAt: date,
      status:JobStatus.IN_PROGRESS
    }})
  }

  revalidatePath(`/admin/jobs/${miniJob.jobId}/${miniJob.id}`);
};