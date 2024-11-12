"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getJob = async (id: string) => {
  try {
    const role = await currentRole();
    if (role != "DEVELOPER") return null;

    const job = await db.job.findUnique({ where: { id } });
    return job;
  } catch (error) {
    return null;
  }
};