"use server";
import * as z from "zod"
import { db } from "@/lib/db";
import { AppointmentSchema } from "@/schemas";

export const appointmentInsert = async (
  values:z.infer<typeof AppointmentSchema> ,
) => {

  const {date,agentId,leadId,comments}=values
  const existingAppointments = await db.appointment.findMany({
    where: { leadId, agentId, status: "Scheduled" },
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
      leadId,
      date:new Date(date),
      comments
          },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }

  return { success: "Appointment Scheduled!" };
};
