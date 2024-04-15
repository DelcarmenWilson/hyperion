"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const voicemailGetUnHeard = async (userId: string) => {
  try {
    const voicemails = await db.call.findMany({
      where: { userId, type: "voicemail", listened: false },
      select: {
        id:true,
        from:true,
        recordUrl: true,
        updatedAt: true,
        lead: { select: { firstName: true, lastName: true } },
      }, orderBy:{createdAt:"desc"}
    });

    return voicemails;
  } catch {
    return [];
  }
};
//ACTIONS
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

