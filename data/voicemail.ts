import { db } from "@/lib/db";

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
