"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import {
  AppointmentLabelSchema,
  AppointmentLeadSchema,
  AppointmentSchema,
} from "@/schemas";
import { userGetByAssistant } from "@/data/user";
import { states } from "@/constants/states";
import {
  smsSendAgentAppointmentNotification,
  smsSendLeadAppointmentNotification,
} from "./sms";

export const appointmentInsert = async (
  values: z.infer<typeof AppointmentSchema>,
  sendSms: boolean = false
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { startDate, agentId, leadId, label, comments } = validatedFields.data;
  let userId = agentId;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }
  const conflctingApp = await db.appointment.findFirst({
    where: { agentId: userId, startDate, status: "Scheduled" },
  });
  if (conflctingApp) {
    return { error: "Conflicting time Please select another time!" };
  }

  const existingAppointment = await db.appointment.findFirst({
    where: { leadId, agentId: userId, status: "Scheduled" },
  });

  if (existingAppointment) {
    await db.appointment.update({
      where: { id: existingAppointment.id },
      data: { status: "Rescheduled" },
    });
  }
  const config = await db.schedule.findUnique({ where: { userId } });
  const appointmentDate = startDate;
  let endDate = startDate;
  if (config?.type == "hourly") {
    endDate.setHours(endDate.getHours() + 1);
  } else {
    endDate.setMinutes(endDate.getMinutes() + 30);
  }
  const appointment = await db.appointment.create({
    data: {
      agentId: userId,
      leadId,
      startDate,
      endDate,
      label,
      comments,
    },
    include: { lead: true },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }
  appointmentDate.setHours(appointmentDate.getHours() - 4);
  const lead = await db.lead.findUnique({ where: { id: leadId } });
  let message;
  if (lead) {
    await smsSendAgentAppointmentNotification(userId, lead, appointmentDate);
    if (sendSms) {
      message = (
        await smsSendLeadAppointmentNotification(userId, lead, appointmentDate)
      ).success;
    }
  }

  // pusher.publish(appointment)
  return { success: { appointment, message } };
};

export const appointmentInsertBook = async (
  values: z.infer<typeof AppointmentLeadSchema>,
  agentId: string,
  startDate: Date
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentLeadSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    id,
    firstName,
    lastName,
    state,
    cellPhone,
    gender,
    maritalStatus,
    email,
  } = validatedFields.data;

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
        userId: agentId,
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
      startDate,
      comments: "",
    },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }

  return { success: "Appointment Scheduled!" };
};

//APPOINTMENT LABELS
export const appointmentLabelInsert = async (
  values: z.infer<typeof AppointmentLabelSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentLabelSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { name, color, description } = validatedFields.data;
  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }

  const existingLabel = await db.appointmentLabel.findFirst({
    where: { userId, color },
  });
  if (existingLabel) {
    return { error: "You already have a label associated with this color!" };
  }

  const label = await db.appointmentLabel.create({
    data: {
      name,
      color,
      description,
      userId,
    }
  });

  if (!label) {
    return { error: "Label was not created!" };
  }
  
  return { success:  label } ;
};

export const appointmentLabelUpdateById = async (
  values: z.infer<typeof AppointmentLabelSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentLabelSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id,name, color, description } = validatedFields.data;
  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }

  const existingLabel = await db.appointmentLabel.findUnique({
    where: { id },
  });
  if (!existingLabel) {
    return { error: "This label does not exist!" };
  }

  const label = await db.appointmentLabel.update({where:{id},
    data: {
      name,
      color,
      description,
    }
  });

  if (!label) {
    return { error: "Label was not updated!" };
  }
  
  return { success:  label } ;
};

export const appointmentLabelUpdateByChecked = async (
  values: z.infer<typeof AppointmentLabelSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentLabelSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id,checked } = validatedFields.data;
  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }
  await db.appointmentLabel.update({where:{id},
    data: {
      checked
    }
  });
  
  return { success:  "Label was updated!" } ;
};