"use server";
import { db } from "@/lib/db";
import { timeDiff, getEntireDay } from "@/formulas/dates";
import { currentUser } from "@/lib/auth";
import { FullCall } from "@/types";
//DATA
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

export const callsGetAllByAgentIdToday = async () => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const calls = await db.call.findMany({
      where: { userId: user.id, createdAt: { gte: getEntireDay().start } },
      include: { lead: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
    return calls as FullCall[];
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
        appointment:true,
      },
      orderBy: { createdAt: "desc" },
    });
    return calls as FullCall[];
  } catch {
    return [];
  }
};

export const callsGetAllByUserIdFiltered = async (from: string, to: string) => {
  try {
    const user = await currentUser();
    if (!user) return [];

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const calls = await db.call.findMany({
      where: { userId: user.id, createdAt: { lte: toDate, gte: fromDate } },
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
        appointment:true,
      },
      orderBy: { createdAt: "desc" },
    });
    return calls as FullCall[];
  } catch {
    return [];
  }
};

export const callsGetAllByLeadId = async (leadId: string) => {
  try {
    const calls = await db.call.findMany({
      where: { leadId },
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
//ACTIONS
export const callInsert = async (
  id: string,
  userId: string,
  leadId: string,
  direction: string
) => {
  try {
    if (!userId) {
      return { error: "User id is required!" };
    }
    if (!leadId) {
      return { error: "Lead id is required!" };
    }
    await db.call.create({
      data: {
        id,
        userId,
        leadId,
        direction: direction,
        status: "",
        from: "",
      },
    });
    return { success: "Call created" };
  } catch (error) {
    return { error: "Internal server Error!" };
  }
};

export const callUpdateByIdShare = async (id: string, shared: boolean) => {
  try {
    await db.call.update({
      where: { id },
      data: {
        shared,
      },
    });
    return { success: `Call ${shared ? "" : "un"}shared` };
  } catch (error) {
    return { error: "Internal server Error!" };
  }
};

export const callUpdateByIdAppointment = async (
  leadId: string,
  appointmentId: string
) => {
  const call = await db.call.findFirst({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
  if (!call) return { error: "Call not found!" };

  const diff = timeDiff(call.createdAt, new Date());

  if (diff > 60) return { error: "Call time is over 1 hour" };

  await db.call.update({
    where: { id: call.id },
    data: {
      appointmentId,
    },
  });
  return { success: "call appointmenthas been updated!" };
};
