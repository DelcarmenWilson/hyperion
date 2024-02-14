import { getLast24hrs } from "@/formulas/dates";
import { db } from "@/lib/db";

export const callGetAllByAgentId = async (userId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { userId },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    });
    return calls;
  } catch {
    return [];
  }
};

export const callGetAllByAgentIdLast24Hours = async (userId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { userId, 
        createdAt: { gte: getLast24hrs() }
       },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
    });
    return calls;
  } catch {
    return [];
  }
};
