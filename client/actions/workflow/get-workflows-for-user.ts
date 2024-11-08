"use server";

import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";

export const getWorkFlowForUser = async () => {
  const user= await currentUser();
  if (!user) throw new Error("unauthenticated");

  return db.workflow.findMany({
    where: { userId:user.id! },
    orderBy: { createdAt: "asc" },
  });
};
