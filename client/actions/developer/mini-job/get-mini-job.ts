"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getMiniJob = async (id: string) => {
  try {
    const role = await currentRole();
    if (role != "DEVELOPER") return null;
    const miniJob = await db.miniJob.findUnique({ where: { id } });
    return miniJob;
  } catch (error) {
    return null;
  }
};