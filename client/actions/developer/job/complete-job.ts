"use server";
import { db } from "@/lib/db";
import {  currentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const completeJob = async (id: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated!");
  if (user.role != "DEVELOPER") throw new Error("Unauthorized!" );

  const job = await db.job.update({
    where: { id },
    data: {
      completedAt: new Date(),
    },
  });
  revalidatePath(`/admin/jobs/${job.id}`)
};
