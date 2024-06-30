import { db } from "@/lib/db";


export const callsGetAllByAgentId = async (userId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { userId },
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
    return calls;
  } catch {
    return [];
  }
};


export const callsGetAllByLeadId = async (leadId: string) => {
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

export const callsGetAllShared = async () => {
  try {
    const calls = await db.call.findMany({
      where: { shared: true },
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
        user: {
          select: {
            firstName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return calls;
  } catch {
    return [];
  }
};
