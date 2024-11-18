"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getBlueprints = async () => {
  const user = await currentUser();
  if (!user) return [];

  const bluePrints = await db.bluePrint.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return bluePrints;
};