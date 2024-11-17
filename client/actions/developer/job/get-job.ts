"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getJob = async (id: string) => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("Unauthorized!" );
  return await db.job.findUnique({ where: { id } });
};
