"use server";

import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getScriptById = async (id:string) => {
  const user= await currentUser();
  if (!user) throw new Error("unauthenticated");

  return db.script.findUnique({
    where: { id, userId:user.id! },
  });
};
