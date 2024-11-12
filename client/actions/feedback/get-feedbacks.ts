"use server";
import { currentRole } from "@/lib/auth";
import { db } from "@/lib/db";

export const getFeedbacks = async () => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("unathroized");
  
  return db.feedback.findMany({
    include: { user: true },
  });
};