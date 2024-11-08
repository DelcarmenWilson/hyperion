"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const voicemailGetUnHeard = async () => {
  try {
    const user=await currentUser()
    if(!user) return []
    const voicemails = await db.call.findMany({
      where: { id:user.id, type: "voicemail", listened: false },
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

