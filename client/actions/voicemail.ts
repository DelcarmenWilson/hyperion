"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

//DATA
export const voicemailGetUnHeard = async (userId: string) => {
  return await db.leadCommunication.findMany({
    where: {
      conversation: { agentId: userId },
      type: "voicemail",
      listened: false,
    },
    include: {
      conversation: {
        select: {
          leadId: true,
          agentId: true,
          lead: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              cellPhone: true,
              email: true,
            },
          },
          agent: {
            select: {
              id: true,
              firstName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
//ACTIONS
export const voicemailUpdateByIdListened = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  await db.leadCommunication.update({
    where: { id },
    data: {
      listened: true,
    },
  });
  return { success: "Voicemail Updated! " };
};
