"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const voicemailGetUnHeard = async (userId: string) => {
  try {
    const voicemails = await db.leadCommunication.findMany({
      where: { userId, type: "voicemail", listened: false },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cellPhone: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return voicemails;
  } catch {
    return [];
  }
};
//ACTIONS
export const voicemailUpdateByIdListened = async (id:string) => {
  const user = await currentUser();
  if (!user) 
    return { error: "Unauthorized" };
  
  
  await db.leadCommunication.update({
    where: { id},
    data: {
      listened:true
    },
  });
  return { success: "Voicemail Updated! " };
};

