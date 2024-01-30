import { db } from "@/lib/db";

export const callGetAllByAgentId = async (agentId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { agentId },
      include: { lead: true },
    });
    return calls;
  } catch {
    return [];
  }
};

export const callGetAllByLeadId = async (leadId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { leadId },
    });
    return calls;
  } catch {
    return [];
  }
};
