"use server";

import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getWorkflowById = async (id:string) => {
  const user= await currentUser();
  if (!user?.id) throw new Error("unauthenticated");

  return db.workflow.findUnique({
    where: { id, userId:user.id },
  });
};
