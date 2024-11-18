"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getActiveBluePrintWeek = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.bluePrintWeek.findFirst({
    where: { bluePrint: { userId: user.id }, active: true },
  });
};
