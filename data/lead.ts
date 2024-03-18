import { getYesterday } from "@/formulas/dates";
import { db } from "@/lib/db";

export const leadsGetAll = async () => {
  try {
    const leads = await db.lead.findMany({ include: { conversation: true } });

    return leads;
  } catch {
    return [];
  }
};

export const leadsGetAllByAgentId = async (userId: string) => {
  try {
    const leads = await db.lead.findMany({
      where: { userId },
      include: {
        conversation: true,
        appointments: { where: { status: "scheduled" } },
        calls: true,
        activities: true,
        beneficiaries:true,
        expenses:true,
        conditions:{include:{condition:true}}
      },
    });
    return leads;
  } catch {
    return [];
  }
};

export const leadGetById = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({
      where: {
        id,
      },
      include: {
        conversation: true,
        appointments: { orderBy: { date: "desc" } },
        calls: { where: { type: "call" }, orderBy: { createdAt: "desc" } },
        activities: { orderBy: { createdAt: "desc" } },
        expenses: true,
        beneficiaries: true,
         conditions: { include: { condition: true } },
      },
    });

    return lead;
  } catch {
    return null;
  }
};

export const leadGetPrevNextById = async (id: string) => {
  try {
    const prev = await db.lead.findMany({
      take: 1,
      select: { id: true },
      where: {
        id: {
          lt: id,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const next = await db.lead.findMany({
      take: 1,
      select: { id: true },
      where: {
        id: {
          gt: id,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return { prev: prev[0]?.id || null, next: next[0]?.id || null };
  } catch {
    return null;
  }
};

export const leadsGetByAgentIdTodayCount = async (userId: string) => {
  try {
    const leads = await db.lead.aggregate({
      _count: { id: true },
      where: {
        userId,
        createdAt: { gte: getYesterday() },
      },
    });

    return leads._count.id;
  } catch {
    return 0;
  }
};
// LEADSTATUS
export const leadStatusGetAllByAgentIdDefault = async (userId: string) => {
  try {
    const leadStatus = await db.leadStatus.findMany({
      where: { OR: [{ userId }, { type: { equals: "default" } }] },
    });
    return leadStatus;
  } catch {
    return [];
  }
};

export const leadStatusGetAllByAgentId = async (userId: string) => {
  try {
    const leadStatus = await db.leadStatus.findMany({
      where: { userId },
    });
    return leadStatus;
  } catch {
    return [];
  }
};
