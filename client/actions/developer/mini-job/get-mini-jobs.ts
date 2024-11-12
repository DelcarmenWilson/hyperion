"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getMiniJobs= async () => {
  try {
    const role = await currentRole();
    if (role != "DEVELOPER") return [];
    const miniJobs = await db.miniJob.findMany();
    return miniJobs;
  } catch (error) {
    return [];
  }
};