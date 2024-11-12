"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getFeedbackById = async (id: string) => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("unauthroized");

  return await db.feedback.findUnique({
    where: { id },
    include: { user: true },
  });
};
