"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { AppointmentLeadSchema, AppointmentSchema } from "@/schemas";
import { states } from "@/constants/states";
import { smsSend } from "./sms";
import { format } from "date-fns";

export const appointmentInsert = async (
  values: z.infer<typeof AppointmentSchema>,
  sendSms: boolean = true
) => {
  const { date, agentId, leadId, comments } = values;
  const conflctingApp = await db.appointment.findFirst({
    where: { agentId,date:new Date(date), status: "Scheduled" },
  });
if(conflctingApp){
  return { error: "Conflicting time Please select another time!" };
}
  const existingAppointment = await db.appointment.findFirst({
    where: { leadId, agentId, status: "Scheduled" },
  });

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
      date: new Date(date),
      comments,
    },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }
  if (sendSms) {
    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (lead) {
      await smsSend(
        lead?.defaultNumber!,
        lead?.cellPhone!,
        `appointment set for ${format(date, "MM-dd @ hh:mm aa")}`
      );
    }
  }
  return { success: appointment };
};

export const appointmentInsertBook = async (
  values: z.infer<typeof AppointmentLeadSchema>,
  agentId: string,
  date: Date
) => {
  
  const {
    id,
    firstName,
    lastName,
    state,
    cellPhone,
    gender,
    maritalStatus,
    email,
  } = values;

  let leadId = id;

  if (!leadId) {
    const st = states.find((e) => e.state == state || e.abv == state);
    const phoneNumbers = await db.phoneNumber.findMany({
      where: { agentId, status: { not: "Deactive" } },
    });

    const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
    const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);
    const lead = await db.lead.create({
      data: {
        firstName,
        lastName,
        state,
        cellPhone,
        gender,
        maritalStatus,
        email,
        defaultNumber: phoneNumber ? phoneNumber.phone : defaultNumber?.phone!,
        userId:agentId
      },
    });

    leadId = lead.id;
  }

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
      date,
      comments: "",
    },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }

  return { success: "Appointment Scheduled!" };
};
