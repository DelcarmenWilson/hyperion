import { db } from "@/lib/db";
import { userGetByAssistant } from "@/actions/user";

//DATA
//APPOINTMENTS

export const appointmentsGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if(!userId) return[]
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

//APPOINTMENT LABELS

export const appointmentLabelsGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if(!userId) return[]
    const labels = await db.appointmentLabel.findMany({
      where: { userId },
    });

    return labels;
  } catch {
    return [];
  }
};