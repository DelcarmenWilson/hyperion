"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getBluePrintWeeks = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  return await db.bluePrintWeek.findMany({
    where: { bluePrint: { userId: user.id } },
    orderBy: { createdAt: "desc" },
  });
};
