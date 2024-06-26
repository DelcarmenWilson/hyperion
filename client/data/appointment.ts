import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";

import { UserRole } from "@prisma/client";
import { userGetByAssistant } from "@/data/user";
import { formatTimeZone, getEntireDay, getToday } from "@/formulas/dates";
import { FullAppointment } from "@/types";
import { states } from "@/constants/states";

//APPOINTMENTS
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

export const appointmentsGetAllByUserId = async (userId: string) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const appointments = await db.appointment.findMany({
      where: { agentId: userId },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    });

    return appointments;
  } catch {
    return [];
  }
};


export const appointmentsGetAllByUserIdUpcoming = async (
  agentId: string,
  role: UserRole = "USER"
) => {
  try {
    if (role == "ASSISTANT") {
      agentId = (await userGetByAssistant(agentId)) as string;
    }
    const today = getToday();

    const appointments = await db.appointment.findMany({
      where: { agentId, status: "Scheduled", startDate: { gte: today } },
    });

    return appointments;
  } catch {
    return [];
  }
};

//APPOINTMENT LABELS

export const appointmentLabelsGetAllByUserId = async (userId: string) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const labels = await db.appointmentLabel.findMany({
      where: { userId },
    });

    return labels;
  } catch {
    return [];
  }
};