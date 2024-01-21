import { db } from "@/lib/db";

export const callGetAllByAgentId = async (agentId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { agentId },
      include: { agent: true, lead: true },
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
      include: { agent: true, lead: true },
    });
    return calls;
  } catch {
    return [];
  }
};
