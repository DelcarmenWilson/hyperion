"use server";
import { db } from "@/lib/db";
import { currentRole} from "@/lib/auth";

export const getJobs = async () => {
  try {
    const role = await currentRole();

    if (role != "DEVELOPER") return [];

    const jobs = await db.job.findMany();
    return jobs;
  } catch (error) {
    return [];
  }
};
