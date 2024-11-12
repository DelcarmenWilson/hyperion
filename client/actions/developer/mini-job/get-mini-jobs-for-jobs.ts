"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";


export const getMiniJobsForJob = async (jobId:string) => {
  try {
    const role = await currentRole();
    if (role != "DEVELOPER") return [];
    const miniJobs = await db.miniJob.findMany({where:{jobId}});
    return miniJobs;
  } catch (error) {
    return [];
  }
};
