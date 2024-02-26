import { getToday, getTommorrow } from "@/formulas/dates";
import { db } from "@/lib/db";

export const appointmentsGetAll = async () => {
  try {
    const appointments = await db.appointment.findMany({
      include: { agent: true, lead: true },
    });

    return appointments;
  } catch {
    return [];
  }
};

export const appointmentsGetAllByUserId = async (agentId: string) => {
  try {
    const appointments = await db.appointment.findMany({
      where: { agentId },
      include: { agent: true, lead: true },
      orderBy: { createdAt: "desc" },
    });

    return appointments;
  } catch {
    return [];
  }
};

export const appointmentsGetAllByUserIdUpcoming = async (agentId: string) => {
  try {
    const today = getToday();

    const appointments = await db.appointment.findMany({
      where: { agentId, status: "Scheduled", date: { gte: today } },
    });

    return appointments;
  } catch {
    return [];
  }
};

export const appointmentsGetAllByUserIdToday = async (agentId: string) => {
  try {
    let today = getToday();

    const appointments = await db.appointment.findMany({
      where: { agentId, status: "scheduled", createdAt: { lt: today } },
      include: { agent: true, lead: true },
    });

    return appointments;
  } catch {
    return [];
  }
};
