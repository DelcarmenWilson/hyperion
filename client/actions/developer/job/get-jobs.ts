"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getJobs = async () => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!" );

  return await db.job.findMany();
};
