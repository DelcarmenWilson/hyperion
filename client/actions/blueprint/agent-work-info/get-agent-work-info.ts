"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getAgentWorkInfo = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!")
 return await db.agentWorkInfo.findUnique({
    where: { userId: user.id },
  });

};
