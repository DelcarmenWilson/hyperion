"use server"
import { db } from "@/lib/db";

// DATA
export const getLeadAppointments = async (leadId: string) => {
 return await db.appointment.findMany({
      where: {
        leadId,
      },
      orderBy: { createdAt: "desc" },
    });
    
};
