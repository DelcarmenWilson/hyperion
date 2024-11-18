"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getActiveBlueprint = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");
 return await db.bluePrint.findFirst({
    where: { userId: user.id, active: true },
  });
};
