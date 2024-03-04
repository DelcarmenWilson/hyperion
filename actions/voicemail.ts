"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const voicemailUpdateByIdListened = async (id:string) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  } 
  
  await db.call.update({
    where: { id},
    data: {
      listened:true
    },
  });
  return { success: "Voicemail Updated! " };
};

