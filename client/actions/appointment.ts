"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";

import {
  AppointmentLabelSchema,
  AppointmentLabelSchemaType,
  AppointmentLeadSchema,
  AppointmentLeadSchemaType,
  AppointmentRescheduleSchema,
  AppointmentRescheduleSchemaType,
  AppointmentSchema,
  AppointmentSchemaType,
} from "@/schemas/appointment";
import { userGetByAssistantOld } from "@/data/user";
import {
  smsSendAgentAppointmentNotification,
  smsSendLeadAppointmentNotification,
  smsSendLeadAppointmentReminder,
} from "./sms";
import { getEntireDay, getToday } from "@/formulas/dates";
import { UserRole } from "@prisma/client";
import { callUpdateByIdAppointment } from "./call";
import { bluePrintWeekUpdateByUserIdData } from "./blueprint/blueprint-week";
import { leadGetOrInsert } from "./lead";
import { sendAppointmentInitialEmail } from "@/lib/mail";
import { leadEmailInsert } from "./lead/email";
import { userGetByAssistant } from "@/actions/user";

//DATA
//TODO - this was created to test the calendar client and the appoint hook inside of it.
export const appointmentsGet = async () => {
  try {
    const userId = await userGetByAssistant();
    if (!userId) return [];

    const appointments = await db.appointment.findMany({
      where: { agentId: userId },
      include: {
        lead: { select: { firstName: true } },
        label: { select: { color: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return appointments;
  } catch {
    return [];
  }
};

export const appointmentsGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if (!userId) return [];

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
  agentId: string | null | undefined,
  role: UserRole = "USER"
) => {
  try {
    if (!agentId) return [];
    if (role == "ASSISTANT") {
      agentId = (await userGetByAssistantOld(agentId)) as string;
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
export const appointmentsGetAllByUserIdToday = async (agentId: string) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      agentId = (await userGetByAssistantOld(agentId)) as string;
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
      userId = (await userGetByAssistantOld(userId)) as string;
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
export const appointmentGetById = async (id: string) => {
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

//APPOINTMENT LABELS
export const appointmentLabelsGetAll = async () => {
  try {
    const userId = await userGetByAssistant();
    if (!userId) return [];
    const labels = await db.appointmentLabel.findMany({
      where: { OR: [{ userId }, { default: { equals: true } }] },
    });
    return labels;
  } catch {
    return [];
  }
};

//ACTIONS
export const appointmentInsert = async (values: AppointmentSchemaType) => {
  //Get current user
  const user = await currentUser();
  //If there is no user -- Unathenticated
  if (!user) return { error: "Unauthenticated" };

  const validatedFields = AppointmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const {
    localDate,
    startDate,
    leadId,
    labelId,
    comments,
    smsReminder,
    emailReminder,
  } = validatedFields.data;
  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistantOld(userId)) as string;
  }
  const conflctingApp = await db.appointment.findFirst({
    where: { agentId: userId, startDate, status: "Scheduled" },
  });
  if (conflctingApp)
    return { error: "Conflicting time Please select another time!" };

  const existingAppointment = await db.appointment.findFirst({
    where: { leadId, agentId: userId, status: "Scheduled" },
  });

  if (existingAppointment)
    await db.appointment.update({
      where: { id: existingAppointment.id },
      data: { status: "Rescheduled" },
    });

  const config = await db.schedule.findUnique({ where: { userId } });
  const appointmentDate = startDate!;
  let endDate = new Date(startDate!);

  if (config?.type == "hourly") endDate.setHours(endDate.getHours() + 1);
  else endDate.setMinutes(endDate.getMinutes() + 30);

  const appointment = await db.appointment.create({
    data: {
      agentId: userId,
      leadId,
      localDate: localDate!,
      startDate: startDate!,
      endDate,
      labelId,
      comments,
    },
    include: { lead: true },
  });

  await callUpdateByIdAppointment(appointment.leadId, appointment.id);

  if (!appointment) return { error: "Appointment was not created!" };

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      user: {
        select: {
          userName: true,
          firstName: true,
          team: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  let message;
  if (lead) {
    await smsSendAgentAppointmentNotification(userId, lead, appointmentDate);
    if (smsReminder) {
      message = (
        await smsSendLeadAppointmentNotification(userId, lead, localDate!)
      ).success;
    }

    if (emailReminder && lead.email) {
      const email = await sendAppointmentInitialEmail(
        lead.email,
        lead.user.team?.name,
        lead.user.userName,
        lead.user.firstName,
        appointment.id,
        appointment.startDate,
        lead.cellPhone
      );
      if (email.data) {
        await leadEmailInsert(
          email.data.id as string,
          "react-email",
          "AppInitailEmail",
          "New Appointment",
          lead.id
        );
      }
    }
  }

  bluePrintWeekUpdateByUserIdData(user.id, "appointments");

  return { success: { appointment, message } };
};

export const appointmentInsertBook = async (
  values: AppointmentLeadSchemaType
) => {
  //Validate the data passed in
  const validatedFields = AppointmentLeadSchema.safeParse(values);
  //If the validation failed return an error and exit the function
  if (!validatedFields.success) return { error: "Invalid fields!" };

  //Destucture the data for easy manipulation
  const {
    id,
    firstName,
    lastName,
    state,
    cellPhone,
    dateOfBirth,
    gender,
    maritalStatus,
    email,
    agentId,
    localDate,
    startDate,
  } = validatedFields.data;

  //Insert or get oldLead with the previous data
  const lead = await leadGetOrInsert(
    {
      id,
      firstName,
      lastName,
      address: "N/A",
      city: "N/A",
      state,
      zipCode: "N/A",
      cellPhone,
      gender,
      maritalStatus,
      email,
      dateOfBirth,
    },
    agentId
  );
  //If lead was not retireved or created return an error and exit the function
  if (!lead.success) return { error: lead.error };
  const leadId = lead.success.id;

  //Get the current scheduled appointment for this lead
  const existingAppointment = await db.appointment.findFirst({
    where: { leadId, agentId, status: "Scheduled" },
  });

  //If there is an exisiting sheduled appointment. set the exisiting appointmnet as Reschedule
  if (existingAppointment) {
    await db.appointment.update({
      where: { id: existingAppointment.id },
      data: { status: "Rescheduled" },
    });
  }
  //Get the agent schedule (availability). Just for the schedule type
  const config = await db.schedule.findUnique({ where: { userId: agentId } });
  //Create and end Date and time based on the startDate and Time
  const endDate = new Date(startDate!);

  //If the scedule type is hourly add one hour to the end date
  //Else add 30 minutes
  if (config?.type == "hourly") endDate.setHours(endDate.getHours() + 1);
  else endDate.setMinutes(endDate.getMinutes() + 30);

  //Try to create the appointment in the database
  const appointment = await db.appointment.create({
    data: {
      agentId,
      leadId,
      startDate: startDate!,
      endDate,
      localDate: localDate!,
      comments: "",
    },
  });
  //If the appointment was not created return and error and exit the function
  if (!appointment) return { error: "Appointment was not created!" };

  //Send appointment reminders both to the agent and to the lead
  await smsSendAgentAppointmentNotification(
    agentId,
    lead.success,
    appointment.startDate
  );
  await smsSendLeadAppointmentNotification(
    agentId,
    lead.success,
    appointment.localDate
  );

  //Update the blue print for this week
  bluePrintWeekUpdateByUserIdData(agentId, "appointments");

  //If everything was successfull return a success message
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
export const appointmentRescheduledByLead = async (
  values: AppointmentRescheduleSchemaType
) => {
  //Validate the data passed in
  const validatedFields = AppointmentRescheduleSchema.safeParse(values);
  //If the validation failed return an error and exit the function
  if (!validatedFields.success) return { error: "Invalid fields!" };

  //Destucture the data for easy manipulation
  const { id, localDate, startDate } = validatedFields.data;

  const existingAppointment = await db.appointment.findUnique({
    where: { id },
  });
  //If there is an exisiting sheduled appointment. set the exisiting appointmnet as Reschedule
  if (!existingAppointment) return { error: "Appointment does not exist" };
  await db.appointment.update({
    where: { id: existingAppointment.id },
    data: { status: "Rescheduled", comments: "Rescheduled by Lead" },
  });

  const { agentId, leadId } = existingAppointment;

  //Get the agent schedule (availability). Just for the schedule type
  const config = await db.schedule.findUnique({ where: { userId: agentId } });
  //Create and end Date and time based on the startDate and Time
  const endDate = new Date(startDate!);

  //If the scedule type is hourly add one hour to the end date
  //else add 30 minutes
  if (config?.type == "hourly") endDate.setHours(endDate.getHours() + 1);
  else endDate.setMinutes(endDate.getMinutes() + 30);

  //try to create the appointment in the database
  const appointment = await db.appointment.create({
    data: {
      agentId,
      leadId,
      startDate: startDate!,
      endDate,
      localDate: localDate!,
      comments: "",
    },
    include: { lead: true },
  });
  //If the appointment was not created return and error and exit the function
  if (!appointment) return { error: "Appointment was not rescheduled!" };

  //Send appointment reminders both to the agent and to the lead
  await smsSendAgentAppointmentNotification(
    agentId,
    appointment.lead,
    appointment.startDate
  );
  await smsSendLeadAppointmentNotification(
    agentId,
    appointment.lead,
    appointment.localDate
  );

  //If everything was successfull return a success message
  return { success: "Appointment rescheduled!" };
};
export const appointmentCanceledByLead = async (id: string, reason: string) => {
  await db.appointment.update({
    where: { id },
    data: {
      status: "Cancelled",
      reason,
    },
  });

  return { success: "Appointment has been canceled" };
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
    userId = (await userGetByAssistantOld(userId)) as string;
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
    userId = (await userGetByAssistantOld(userId)) as string;
  }

  const existingLabel = await db.appointmentLabel.findUnique({
    where: { id },
  });
  if (!existingLabel) 
    return { error: "This label does not exist!" };
  
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
    userId = (await userGetByAssistantOld(userId)) as string;
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
    include: {
      lead: true,
      agent: { include: { chatSettings: true, notificationSettings: true } },
    },
  });

  if (appointments.length == 0) {
    return { error: "No reminders available" };
  }

  for (const app of appointments) {
    const { agent, lead, startDate } = app;
    const minutesRemaining = Math.floor(
      (startDate.getTime() - currentDate.getTime()) / 1000 / 60
    );
    await smsSendLeadAppointmentReminder(lead, minutesRemaining);
  }

  return { success: appointments };
};
