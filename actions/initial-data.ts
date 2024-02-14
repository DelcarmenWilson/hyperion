"use server";

import { db } from "@/lib/db";
import {
  Appointment,
  Call,
  ChatSettings,
  Conversation,
  Lead,
  Message,
  PhoneNumber,
  Presets,
  Schedule,
  User,
} from "@prisma/client";

export const initialUsers = async (values: User[]) => {
  const users = await db.user.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${users.count} users out of ${values.length} have been imported`,
  };
};

export const initialChatSettings = async (values: ChatSettings[]) => {
  const chatsettings = await db.chatSettings.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${chatsettings.count} chat settings out of ${values.length} have been imported`,
  };
};

export const initialPresets = async (values: Presets[]) => {
  const presets = await db.presets.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${presets.count} presets out of ${values.length} have been imported`,
  };
};

export const initialSchedules = async (values: Schedule[]) => {
  const schedule = await db.schedule.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${schedule.count} schedules out of ${values.length} have been imported`,
  };
};

export const initialLeads = async (values: Lead[]) => {
  const leads = await db.lead.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${leads.count} leads ot of ${values.length} have been imported`,
  };
};

export const initialCalls = async (values: Call[]) => {
  const calls = await db.call.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${calls.count} calls out of ${values.length} have been imported`,
  };
};

export const initialAppointments = async (values: Appointment[]) => {
  const appointments = await db.appointment.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${appointments.count} appointments out of ${values.length} have been imported`,
  };
};

export const initialConversations = async (values: Conversation[]) => {
  const conversations = await db.conversation.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${conversations.count} conversations out of ${values.length} have been imported`,
  };
};

export const initialMessages = async (values: Message[]) => {
  const messages = await db.message.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${messages.count} messages out of ${values.length} have been imported`,
  };
};

export const initialPhoneNumbers = async (values: PhoneNumber[]) => {
  const phoneNumber  = await db.phoneNumber.createMany({
    data: values,
    skipDuplicates: true,
  });
  return {
    success: `${phoneNumber.count} phone numbers out of ${values.length} have been imported`,
  };
};