"use server";
import { db } from "@/lib/db";
import { currentRole, currentUser } from "@/lib/auth";
import { sendAppointmentInitialEmail } from "@/lib/mail";

import { UserRole } from "@prisma/client";
import { AppointmentStatus } from "@/types/appointment";
import { NotificationReference } from "@/types/notification";
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
  smsSend,
  smsSendAgentAppointmentNotification,
  smsSendLeadAppointmentNotification,
  smsSendLeadAppointmentReminder,
} from "./sms";

import { getEntireDay, getToday } from "@/formulas/dates";
import { updateCallAppointment } from "./call";

import { getOrCreateLead } from "@/actions/lead";
import { getAssitantForUser } from "@/actions/user";
import { createEmail } from "@/actions/email/create-email";
import { updateBluePrintWeekData } from "@/actions/blueprint/week";
import { createNotification } from "./notification";
import { DateRange } from "react-day-picker";

//DATA
//TODO - this was created to test the calendar client and the appoint hook inside of it.
export const getAppointmentsTest = async () => {
  try {
    const userId = await getAssitantForUser();
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

export const getAppointments = async () => {
  try {
    const userId = await getAssitantForUser();
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

export const getAppointment = async (id: string) => {
  return await db.appointment.findUnique({
    where: { id },
    include: { lead: true },
  });
};

export const getUpcomingAppointments = async (
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
export const getTodaysAppointments = async (agentId: string) => {
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
export const getAppointmentsForUser = async ({
  userId,
  dateRange,
}: {
  userId: string;
  dateRange: DateRange;
}) => {
  try {
    const role = await currentRole();
    if (role == "ASSISTANT") {
      userId = (await userGetByAssistantOld(userId)) as string;
    }

    const appointments = await db.appointment.findMany({
      where: {
        agentId: userId,
        startDate: { gte: dateRange.from, lte: dateRange.to },
      },
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

//APPOINTMENT LABELS
export const getAppointmentLabels = async () => {
  const userId = await getAssitantForUser();
  if (!userId) throw new Error("Unauthenticated!");
  return await db.appointmentLabel.findMany({
    where: { OR: [{ userId }, { default: { equals: true } }] },
  });
};

//ACTIONS
export const createAppointment = async (values: AppointmentSchemaType) => {
  //Get current user
  const user = await currentUser();
  //If there is no user -- Unauthenticated
  if (!user) throw new Error("Unauthenticated!");

  const { data, success } = AppointmentSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  const {
    localDate,
    startDate,
    leadId,
    labelId,
    comments,
    smsReminder,
    emailReminder,
  } = data;

  let userId = user.id;
  if (user.role == "ASSISTANT") {
    userId = (await userGetByAssistantOld(userId)) as string;
  }

  //check the agents schedule and see if there in an appointment already made
  const conflctingApp = await db.appointment.findFirst({
    where: { agentId: userId, startDate: data.startDate, status: "Scheduled" },
  });

  if (conflctingApp)
    throw new Error("Conflicting time Please select another time!");

  const existingAppointment = await db.appointment.findFirst({
    where: { leadId: data.leadId, agentId: userId, status: "Scheduled" },
  });

  if (existingAppointment)
    await db.appointment.update({
      where: { id: existingAppointment.id },
      data: { status: "Rescheduled" },
    });

  //get the agents availability
  const config = await db.schedule.findUnique({ where: { userId } });
  const appointmentDate = data.startDate!;
  let endDate = new Date(data.startDate!);

  if (config?.type == "hourly") endDate.setHours(endDate.getHours() + 1);
  else endDate.setMinutes(endDate.getMinutes() + 30);

  const appointment = await db.appointment.create({
    data: {
      leadId,
      labelId,
      comments,
      agentId: userId,
      endDate,
      localDate: localDate!,
      startDate: startDate!,
      status: AppointmentStatus.SCHEDULED,
    },
    include: { lead: true },
  });

  await updateCallAppointment({
    leadId: appointment.leadId,
    appointmentId: appointment.id,
  });

  if (!appointment) return { error: "Appointment was not created!" };

  const lead = await db.lead.findUnique({
    where: { id: data.leadId },
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
    await smsSendAgentAppointmentNotification({
      firstName: lead.firstName,
      lastName: lead.lastName,
      defaultNumber: lead.defaultNumber,
      userId,
      date: appointmentDate,
    });
    if (smsReminder) {
      message = await smsSendLeadAppointmentNotification({
        leadId: lead.id,
        firstName: lead.firstName,
        defaultNumber: lead.defaultNumber,
        cellPhone: lead.cellPhone,
        userId,
        date: localDate!,
      });
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
        await createEmail({
          id: email.data.id as string,
          type: "react-email",
          body: "AppInitailEmail",
          subject: "New Appointment",
          leadId: lead.id,
          userId: user.id,
        });
      }
    }
  }

  updateBluePrintWeekData(user.id, "appointments");

  return { success: { appointment, message } };
};

export const createBookingAppointment = async (
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
  const lead = await getOrCreateLead(
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
      endDate,
      startDate: startDate!,
      localDate: localDate!,
      comments: "",
      status: AppointmentStatus.SCHEDULED,
    },
  });
  //If the appointment was not created return and error and exit the function
  if (!appointment) return { error: "Appointment was not created!" };

  //Send appointment reminders both to the agent and to the lead
  await smsSendAgentAppointmentNotification({
    firstName: lead.success.firstName,
    lastName: lead.success.lastName,
    defaultNumber: lead.success.defaultNumber,
    userId: agentId,
    date: appointment.startDate,
  });
  await smsSendLeadAppointmentNotification({
    leadId: lead.success.id,
    firstName: lead.success.firstName,
    defaultNumber: lead.success.defaultNumber,
    cellPhone: lead.success.cellPhone,
    userId: agentId,
    date: appointment.localDate,
  });

  //Update the blue print for this week
  updateBluePrintWeekData(agentId, "appointments");

  //If everything was successfull return a success message
  return { success: "Appointment Scheduled!" };
};

export const updateAppointmentStatus = async (values: {
  id: string;
  status: string;
}) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated" };

  const { id, status } = values;
  const existingAppointment = await db.appointment.findUnique({
    where: { id },
  });
  if (!existingAppointment) return { error: "appointment does not exist" };

  if (existingAppointment.agentId != user.id) return { error: "Unauthorized" };

  const updatedAppointment = await db.appointment.update({
    where: { id },
    data: {
      status,
    },
  });

  return { success: { updatedAppointment } };
};
export const rescheduleAppointmentByLead = async (
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
    data: {
      status: AppointmentStatus.RESCHEDULED,
      comments: "Rescheduled by Lead",
    },
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
      status: AppointmentStatus.SCHEDULED,
    },
    include: { lead: true },
  });
  //If the appointment was not created return and error and exit the function
  if (!appointment) return { error: "Appointment was not rescheduled!" };
  const lead = appointment.lead;
  //Send appointment reminders both to the agent and to the lead
  await smsSendAgentAppointmentNotification({
    firstName: lead.firstName,
    lastName: lead.lastName,
    defaultNumber: lead.defaultNumber,
    userId: agentId,
    date: appointment.startDate,
  });
  await smsSendLeadAppointmentNotification({
    leadId: lead.id,
    firstName: lead.firstName,
    defaultNumber: lead.defaultNumber,
    cellPhone: lead.cellPhone,
    userId: agentId,
    date: appointment.localDate,
  });

  //If everything was successfull return a success message
  return { success: "Appointment rescheduled!" };
};
// TODO- See if we can consolidate the next two functions
export const cancelAppointmentByLead = async ({
  id,
  reason,
}: {
  id: string;
  reason: string;
}) => {
  await db.appointment.update({
    where: { id },
    data: {
      status: AppointmentStatus.CANCELLED,
      reason: `Cancelled by Lead - ${reason}`,
    },
  });

  return { success: "Appointment has been canceled" };
};
export const cancelAppointmentAgent = async ({
  id,
  reason,
}: {
  id: string;
  reason: string;
}) => {
  await db.appointment.update({
    where: { id },
    data: {
      status: AppointmentStatus.CANCELLED,
      reason: `Cancelled by Agent - ${reason}`,
    },
  });

  return { success: "Appointment has been canceled" };
};
//APPOINTMENT LABELS
export const createAppointmentLabel = async (
  values: AppointmentLabelSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = AppointmentLabelSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  let userId = user.id;
  if (user.role == "ASSISTANT")
    userId = (await userGetByAssistantOld(userId)) as string;

  const existingLabel = await db.appointmentLabel.findFirst({
    where: { userId, color: data.color },
  });
  if (existingLabel)
    throw new Error("You already have a label associated with this color!");

  const label = await db.appointmentLabel.create({
    data: {
      ...data,
      userId,
    },
  });

  if (!label) throw new Error("Label was not created!");

  return label;
};

export const updateAppointmentLabel = async (
  values: AppointmentLabelSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = AppointmentLabelSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  let userId = user.id;
  if (user.role == "ASSISTANT")
    userId = (await userGetByAssistantOld(userId)) as string;

  const existingLabel = await db.appointmentLabel.findUnique({
    where: { id: data.id },
  });
  if (!existingLabel) throw new Error("This label does not exist!");

  const label = await db.appointmentLabel.update({
    where: { id: data.id },
    data: {
      ...data,
    },
  });

  if (!label) throw new Error("Label was not updated!");

  return label;
};

export const updateAppointmentLabelChecked = async (
  values: AppointmentLabelSchemaType
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = AppointmentLabelSchema.safeParse(values);

  if (!success) throw new Error("Invalid fields!");

  const { id, checked } = data;
  let userId = user.id;
  if (user.role == "ASSISTANT")
    userId = (await userGetByAssistantOld(userId)) as string;

  await db.appointmentLabel.update({
    where: { id },
    data: {
      checked,
    },
  });

  return "Label was updated!";
};

//create notification alert for appointment
export const sendAppointmentReminders = async () => {
  // wee need current datetime and + one hour datetime
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);

  const appointments = await db.appointment.findMany({
    where: {
      startDate: { gt: startDate, lte: endDate },
      status: AppointmentStatus.SCHEDULED,
    },
    include: {
      lead: true,
      agent: { include: { chatSettings: true, notificationSettings: true } },
    },
  });

  if (appointments.length == 0) return { error: "No reminders available" };

  for (const app of appointments) {
    const { agent, lead, startDate } = app;
    const minutesRemaining = Math.floor(
      (startDate.getTime() - startDate.getTime()) / 1000 / 60
    );
    await smsSendLeadAppointmentReminder(lead, minutesRemaining);
  }

  return { success: appointments };
};

//Update appointment status from a call
const MINCALLDURATION = 60;
export const updatAppointmentStatusFromCall = async ({
  callId,
  leadId,
  agentId,
  duration,
  direction,
  setAppointment,
}: {
  callId: string;
  leadId: string;
  agentId: string;
  duration: number;
  direction: string;
  setAppointment: boolean;
}) => {
  const startTime = new Date();
  startTime.setMinutes(startTime.getMinutes() - 30);
  const endTime = new Date();
  const appointment = await db.appointment.findFirst({
    where: {
      leadId,
      agentId,
      OR: [
        {
          endDate: {
            gte: startTime,
            lte: endTime,
          },
        },
        {
          status: {
            in: [AppointmentStatus.SCHEDULED, AppointmentStatus.NO_SHOW],
          },
        },
      ],
    },
  });
  if (!appointment) return;

  let reason = appointment.reason;
  switch (direction) {
    case "inbound":
      if (duration < MINCALLDURATION) reason = "Agent No Show";
      else reason = "Closed";
      break;
    case "outbound":
      if (duration < MINCALLDURATION) reason = "Lead No Show";
      else reason = "Closed";
      break;
  }

  await db.appointment.update({
    where: { id: appointment.id },
    data: {
      status:
        duration > MINCALLDURATION
          ? AppointmentStatus.CLOSED
          : AppointmentStatus.NO_SHOW,
      reason,
    },
  });

  if (setAppointment)
    await db.leadCommunication.update({
      where: { id: callId },
      data: {
        appointment: { connect: appointment },
      },
    });
};
//CRON SCHEDULING

export const closeOpenAppointments = async (test: boolean = false) => {
  const timeDiff = test ? 60 : 5;
  const startTime = new Date();
  const endTime = new Date();
  startTime.setMinutes(startTime.getMinutes() - timeDiff);
  endTime.setMinutes(endTime.getMinutes() + timeDiff);

  const appointments = await db.appointment.findMany({
    where: {
      status: AppointmentStatus.SCHEDULED,
      endDate: {
        gte: startTime,
        lte: endTime,
      },
    },
    include: {
      agent: {
        select: {
          phoneSettings: { select: { personalNumber: true } },
          phoneNumbers: {
            where: { status: "default" },
            select: { phone: true },
          },
        },
      },
      lead: { select: { firstName: true, lastName: true } },
    },
  });

  for (const appointment of appointments) {
    await db.appointment.update({
      where: { id: appointment.id },
      data: {
        status: AppointmentStatus.NO_SHOW,
        reason: "Agent and Lead no show",
      },
    });
    const personalNumber = appointment.agent.phoneSettings?.personalNumber;
    const message = `Hyperion Notifications \n You missed an appointment with ${appointment.lead.firstName} ${appointment.lead.lastName}`;

    if (personalNumber) {
      await smsSend({
        fromPhone: appointment.agent.phoneNumbers[0].phone,
        toPhone: personalNumber,
        message,
      });
    }

    await createNotification({
      reference: NotificationReference.APPOINTMENT,
      title: "Missed appointment",
      content: message,
      userId: appointment.agentId,
      link: `/appointments/${appointment.id}`,
      linkText: "View Appointment",
      read: false,
    });

    return { success: "Message sent!" };
  }

  // const appointment = await db.appointment.updateMany({
  //   where: {
  //     status: AppointmentStatus.SCHEDULED,
  //     endDate: {
  //       gte: startTime,
  //       lte: endTime,
  //     },
  //   },
  //   data: {
  //     status: AppointmentStatus.NO_SHOW,
  //     reason: "Agent and Lead no show",
  //   },
  // });
};
