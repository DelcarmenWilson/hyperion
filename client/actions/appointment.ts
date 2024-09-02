"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";

import {
  AppointmentLabelSchema,
  AppointmentLabelSchemaType,
  AppointmentLeadSchema,
  AppointmentLeadSchemaType,
  AppointmentSchema,
  AppointmentSchemaType,
} from "@/schemas/appointment";
import { userGetByAssistant } from "@/data/user";
import { states } from "@/constants/states";
import {
  smsSendAgentAppointmentNotification,
  smsSendLeadAppointmentNotification,
  smsSendLeadAppointmentReminder,
} from "./sms";
import { getEntireDay } from "@/formulas/dates";
import { Lead } from "@prisma/client";
import { bluePrintUpdateByUserIdData } from "./blueprint/blueprint";
import { callUpdateByIdAppointment } from "./call";
import { bluePrintWeekUpdateByUserIdData } from "./blueprint/blueprint-week";

//DATA
export const appointmentsGetAllByUserIdToday = async (agentId: string) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      agentId = (await userGetByAssistant(agentId)) as string;
    }
    const today = getEntireDay();
    const appointments = await db.appointment.findMany({
      where: {
        agentId,
        status: "Scheduled",
        startDate: { lt: today.end, gt: today.start },
      },
      include: { agent: true, lead: true },
    });

    return appointments;
  } catch {
    return [];
  }
};
export const appointmentsGetByUserIdFiltered = async (
  userId: string,
  from: string,
  to: string
) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistant(userId)) as string;
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const appointments = await db.appointment.findMany({
      where: { agentId: userId, startDate: { lte: toDate, gte: fromDate } },
      include: { lead: true },
      orderBy: { createdAt: "desc" },
    });

    // const fullAppointments: FullAppointment[] = appointments.map(
    //   (appointment) => {
    //     const timeZone =
    //       states.find(
    //         (e) =>
    //           e.abv.toLocaleLowerCase() ==
    //           appointment.lead.state.toLocaleLowerCase()
    //       )?.zone || "US/Eastern";
    //     return {
    //       ...appointment,
    //       zone: timeZone,
    //       time: formatTimeZone(appointment.startDate, timeZone),
    //     };
    //   }
    // );

    return appointments;
  } catch {
    return [];
  }
};
export const appointmentsGetById = async (id: string) => {
  try {
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: { lead: true },
    });
    return appointment;
  } catch {
    return null;
  }
};

//ACTIONS
export const appointmentInsert = async (values: AppointmentSchemaType) => {
  //Get current user
  const user = await currentUser();
  //If there is no user -- Unathenticated
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { localDate, startDate, agentId, leadId, label, comments, reminder } =
    validatedFields.data;
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
  let endDate = new Date(startDate);

  if (config?.type == "hourly") {
    endDate.setHours(endDate.getHours() + 1);
  } else {
    endDate.setMinutes(endDate.getMinutes() + 30);
  }
  const appointment = await db.appointment.create({
    data: {
      agentId: userId,
      leadId,
      localDate,
      startDate,
      endDate,
      label,
      comments,
    },
    include: { lead: true },
  });

  await callUpdateByIdAppointment(appointment.leadId, appointment.id);

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }

  const lead = await db.lead.findUnique({ where: { id: leadId } });
  let message;
  if (lead) {
    await smsSendAgentAppointmentNotification(userId, lead, appointmentDate);
    if (reminder) {
      message = (
        await smsSendLeadAppointmentNotification(userId, lead, localDate)
      ).success;
    }
  }

  bluePrintWeekUpdateByUserIdData(user.id, "appointments");

  return { success: { appointment, message } };
};

export const appointmentInsertBook = async (
  values: AppointmentLeadSchemaType,
  agentId: string,
  startDate: Date,
  localDate: Date
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
  let lead: Lead | undefined;

  if (!leadId) {
    const st = states.find((e) => e.state == state || e.abv == state);
    const phoneNumbers = await db.phoneNumber.findMany({
      where: { agentId, status: { not: "Deactive" } },
    });

    const defaultNumber = phoneNumbers.find((e) => e.status == "Default");
    const phoneNumber = phoneNumbers.find((e) => e.state == st?.abv);
    lead = await db.lead.create({
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
  } else {
    const dbLead = await db.lead.findUnique({ where: { id: leadId } });
    if (dbLead) {
      lead = dbLead;
    }
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

  const config = await db.schedule.findUnique({ where: { userId: agentId } });
  let endDate = new Date(startDate);

  if (config?.type == "hourly") {
    endDate.setHours(endDate.getHours() + 1);
  } else {
    endDate.setMinutes(endDate.getMinutes() + 30);
  }

  const appointment = await db.appointment.create({
    data: {
      agentId,
      leadId,
      startDate,
      endDate,
      localDate,
      comments: "",
    },
  });

  if (!appointment) {
    return { error: "Appointment was not created!" };
  }

  await smsSendAgentAppointmentNotification(agentId, lead, startDate);
  await smsSendLeadAppointmentNotification(agentId, lead, localDate);

  return { success: "Appointment Scheduled!" };
};

export const appointmentUpdateByIdStatus = async (values: {
  id: string;
  status: string;
}) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthenticated" };
  }
  const { id, status } = values;
  const existingAppointment = await db.appointment.findUnique({
    where: { id },
  });
  if (!existingAppointment) {
    return { error: "appointment does not exist" };
  }

  if (existingAppointment.agentId != user.id) {
    return { error: "Unauthorized" };
  }

  const updatedAppointment = await db.appointment.update({
    where: { id },
    data: {
      status,
    },
  });

  return { success: { updatedAppointment } };
};

//APPOINTMENT LABELS
export const appointmentLabelInsert = async (
  values: AppointmentLabelSchemaType
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
    },
  });

  if (!label) {
    return { error: "Label was not created!" };
  }

  return { success: label };
};

export const appointmentLabelUpdateById = async (
  values: AppointmentLabelSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentLabelSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, name, color, description } = validatedFields.data;
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

  const label = await db.appointmentLabel.update({
    where: { id },
    data: {
      name,
      color,
      description,
    },
  });

  if (!label) {
    return { error: "Label was not updated!" };
  }

  return { success: label };
};

export const appointmentLabelUpdateByChecked = async (
  values: AppointmentLabelSchemaType
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unathenticated" };
  }
  const validatedFields = AppointmentLabelSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { id, checked } = validatedFields.data;
  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistant(userId)) as string;
  }
  await db.appointmentLabel.update({
    where: { id },
    data: {
      checked,
    },
  });

  return { success: "Label was updated!" };
};

//create notification alert for appointment

export const sendAppointmentReminders = async () => {
  // wee need current datetime and + one hour datetime

  const currentDate = new Date();

  const oneHourPlusDate = new Date(currentDate);

  oneHourPlusDate.setHours(oneHourPlusDate.getHours() + 1);

  const appointments = await db.appointment.findMany({
    where: {
      startDate: { gt: currentDate, lte: oneHourPlusDate },
      status: "Scheduled",
    },
    include: { lead: true, agent: { include: { chatSettings: true,notificationSettings:true } } },
  });

  if (appointments.length == 0) {
    return { error: "No reminders available" };
  }

  for (const app of appointments) {
    const { agent, lead, startDate } = app;
    const minutesRemaining = Math.floor((startDate.getTime() - currentDate.getTime())/1000/60);
    await smsSendLeadAppointmentReminder(lead,minutesRemaining)
   

  }

  return { success: appointments };
};
