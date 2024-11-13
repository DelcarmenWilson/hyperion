"use server";
import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

export const getFeedbacks = async () => {
  const role = await currentRole();
  if (role != "DEVELOPER") throw new Error("unathroized");

  return db.feedback.findMany({
    include: { user: { select: { id: true, firstName: true } } },
  });
};
