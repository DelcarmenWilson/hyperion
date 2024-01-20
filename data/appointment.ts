import { db } from "@/lib/db";

export const appointmentGetAll = async () => {
  try {
    const appointments = await db.appointment.findMany({
      include: { agent: true, lead: true },
    });
    
    return appointments;
  } catch {
    return [];
  }
};
