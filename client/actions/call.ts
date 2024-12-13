"use server";
import { db } from "@/lib/db";
import { timeDiff, getEntireDay } from "@/formulas/dates";
import { currentUser } from "@/lib/auth";
import { FullCall } from "@/types";
import { NotificationReference } from "@/types/notification";
import { createNotification, updateExitingNotification } from "./notification";
import { DateRange } from "react-day-picker";
import { string } from "zod";
import { connect } from "http2";
//DATA
//TODO - need to refactor thsi file
export const getCallsForUser = async (userId: string) => {
  return await db.leadCommunication.findMany({
    where: { userId },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getCallsForToday = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const calls = await db.leadCommunication.findMany({
    where: { userId: user.id, createdAt: { gte: getEntireDay().start } },
    include: { lead: true, appointment: true },
    orderBy: { createdAt: "desc" },
  });
  return calls as FullCall[];
};

export const getCallsForUserFiltered = async ({
  userId,
  dateRange,
}: {
  userId: string;
  dateRange: DateRange;
}) => {
  const calls = await db.leadCommunication.findMany({
    where: { userId, createdAt: { lte: dateRange.to, gte: dateRange.from } },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
      appointment: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return calls as FullCall[];
};

export const getMultipleCalls = async ({
  callIds,
}: {
  callIds: string[] | undefined;
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");

  return await db.leadCommunication.findMany({
    where: { userId: user.id, id: { in: callIds } },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
    },
  });
};

export const getCallsFiltered = async (dateRange: DateRange) => {
  const user = await currentUser();
  if (!user) throw new Error("Unathenticated!");
  const calls = await db.leadCommunication.findMany({
    where: {
      userId: user.id,
      createdAt: { lte: dateRange.to, gte: dateRange.from },
    },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
      appointment: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return calls as FullCall[];
};

export const getCallsForLead = async (leadId: string) => {
  return await db.leadCommunication.findMany({
    where: { leadId },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getInboundCalls = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  return await db.leadCommunication.findMany({
    where: {
      userId: user.id,
      direction: "inbound",
      status: { not: "no-answer" },
    },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });
};

export const getOutboundCalls = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  return await db.leadCommunication.findMany({
    where: { userId: user.id, direction: "outbound" },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });
};

export const getMissedCalls = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated");
  return await db.leadCommunication.findMany({
    where: { userId: user.id, direction: "inbound", status: "no-answer" },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });
};

export const getSharedCalls = async () => {
  return await db.leadCommunication.findMany({
    where: { shared: true },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          cellPhone: true,
          email: true,
        },
      },
      user: {
        select: {
          firstName: true,
        },
      },
      appointment:true
    },
    orderBy: { createdAt: "desc" },
  });
};
//ACTIONS
export const createCall = async (data: {
  id: string;
  agentId: string;
  leadId: string;
  direction: string;
  from: string;
  status: string;
}) => {
  if (!data.agentId) throw new Error("Agent id is required!");
  if (!data.leadId) throw new Error("Lead id is required!");

  const conversation = await db.leadConversation.upsert({
    where: { leadId_agentId: { leadId: data.leadId, agentId: data.agentId } },
    update: {
      unread: { increment: data.direction == "outbound" ? 1 : 0 },
    },
    create: {
      leadId: data.leadId,
      agentId: data.agentId,
    },
  });

  const call = await db.leadCommunication.create({
    data: {
      ...data,
      conversationId: conversation.id,
    },
  });
  await db.leadConversation.update({
    where: { id: conversation.id },
    data: {
      lastCommunicationId: call.id,
    },
  });
  return "Call created";
};

export const shareCall = async ({
  id,
  shared,
}: {
  id: string;
  shared: boolean;
}) => {
  await db.leadCommunication.update({
    where: { id },
    data: {
      shared,
    },
  });
  return `Call ${shared ? "" : "un"}shared`;
};

export const updateCallAppointment = async ({
  leadId,
  appointmentId,
}: {
  leadId: string;
  appointmentId: string;
}) => {
  const call = await db.leadCommunication.findFirst({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
  if (!call) return "Call not found!";

  const diff = timeDiff(call.createdAt, new Date());

  if (diff > 60) throw new Error("Call time is over 1 hour");

  await db.leadCommunication.update({
    where: { id: call.id },
    data: {
      appointmentId,
    },
  });
  return "call appointmenthas been updated!";
};

//CREATE OR UPDATE MISSED CALL NOTIFICATION
export const createOrUpdateMissedCallNotification = async ({
  callId,
  userId,
}: {
  callId: string;
  userId: string;
}) => {
  const exisitingNotification = await db.notification.findFirst({
    where: {
      userId,
      reference: NotificationReference.MISSED_CALL,
      read: false,
    },
  });

  if (exisitingNotification) {
    let calls = JSON.parse(exisitingNotification.link as string) as string[];
    calls.push(callId);

    await updateExitingNotification({
      id: exisitingNotification.id,
      link: JSON.stringify(calls),
      content: `You have (${calls.length}) missed call`,
    });
  } else {
    await createNotification({
      reference: NotificationReference.MISSED_CALL,
      title: "Missed call",
      content: "You have (1) missed call",
      linkText: "View Calls",
      link: `["${callId}"]`,
      userId,
      read: false,
    });
  }
};
