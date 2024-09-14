"use server"
import { db } from "@/lib/db";

// DATA
export const leadAppointmentsGetAllByLeadId = async (leadId: string) => {
  try {
    const appointments = await db.appointment.findMany({
      where: {
        leadId,
      },
      orderBy: { createdAt: "desc" },
    });
    return appointments;
  } catch {
    return [];
  }
};
