import { db } from "@/lib/db";
import { getEntireDay, getLast24hrs } from "@/formulas/dates";

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

export const callsGetAllByAgentIdFiltered = async (
  userId: string,
  from: string,
  to: string
) => {
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const calls = await db.call.findMany({
      where: { userId, createdAt: { lte: toDate, gte: fromDate } },
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

export const callsGetAllByAgentIdToday = async (userId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { userId, createdAt: { gte: getEntireDay().start } },
      include: { lead: true },
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
