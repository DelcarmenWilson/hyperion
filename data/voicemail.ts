import { db } from "@/lib/db";

export const voicemailGetUnHeard = async (userId: string) => {
  try {
    const voicemails = await db.call.findMany({
      where: { userId, type: "voicemail", listened: false },
      include: { lead:true },
    });

    return voicemails;
  } catch {
    return [];
  }
};
