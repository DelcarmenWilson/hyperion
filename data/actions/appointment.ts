"use server";

import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";
import { db } from "@/lib/db";

export const appointmentInsert = async (
  agentId: string,
  lead: LeadColumn,
  date: Date
) => {

  const existingAppointments = await db.appointment.findMany({
    where: { leadId: lead.id, agentId, status: "Scheduled" },
  });

  const existingAppointment = existingAppointments[0];
  if (existingAppointment) {
    await db.appointment.update({
      where: { id: existingAppointment.id },
      data: { status: "Rescheduled" },
    });
  }

  const appointment = await db.appointment.create({
    data: {  
        agentId,
      leadId: lead.id,    
      date,
      comments:""      
          },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }

  return { success: "Appointment Scheduled!" };
};
