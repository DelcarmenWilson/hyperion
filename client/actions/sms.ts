"use server";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { conversationInsert } from "./conversation";
import { messageInsert } from "./message";
import { defaultChat, defaultOptOut } from "@/placeholder/chat";
import { replacePreset } from "@/formulas/text";
import { getRandomNumber } from "@/formulas/numbers";
import { cfg, client } from "@/lib/twilio/config";
import { SmsMessageSchema } from "@/schemas";
import { HyperionLead, Lead } from "@prisma/client";
import { format } from "date-fns";
import { hyperionDate } from "@/formulas/dates";
import { userGetByAssistant } from "@/data/user";

export const smsCreateInitial = async (leadId: string) => {
  const dbuser = await currentUser();
  if (!dbuser) {
    return { error: "Unauthenticated" };
  }

  const user = await db.user.findUnique({ where: { id: dbuser.id } });
  if (!user) {
    return { error: "Unauthorized" };
  }

  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) {
    return { error: "Lead does not exist" };
  }

  const existingConversation = await db.conversation.findFirst({
    where: {
      lead: { id: lead.id },
    },
  });

  if (existingConversation) {
    return { error: "Conversation Already exist" };
  }

  const presets = await db.presets.findMany({
    where: { agentId: user.id, type: "Text" },
  });
  const rnd = getRandomNumber(0, 2);
  const preset = presets[rnd];

  const chatSettings = await db.chatSettings.findUnique({
    where: { userId: user.id },
  });

  let prompt = chatSettings?.defaultPrompt
    ? chatSettings?.defaultPrompt
    : defaultChat.prompt;

  let message = preset ? preset.content : defaultChat.message;

  prompt = replacePreset(prompt, user, lead);
  message = replacePreset(message, user, lead);
  message += ` ${defaultOptOut.request}`;

  if (chatSettings?.leadInfo) {
    const leadInfo = {
      "first Name": lead.firstName,
      "last Name": lead.lastName,
      "Date Of Birth": lead.dateOfBirth,
      address: lead.address,
      city: lead.city,
      state: lead.state,
    };
    prompt += `Todays Date is ${new Date()} Here is my information: ${JSON.stringify(
      leadInfo
    )}  `;
  }

  const conversationId = (await conversationInsert(user.id, lead.id, chatSettings?.autoChat))
    .success;

  if (!conversationId) {
    return { error: "Conversation was not created" };
  }

  await messageInsert({
    role: "system",
    content: prompt,
    conversationId,
    senderId: user.id,
    hasSeen: false,
  });

  const result = await client.messages.create({
    body: message,
    from: lead.defaultNumber,
    to: lead.cellPhone || (lead.homePhone as string),
    applicationSid: cfg.twimlAppSid,
  });

  await messageInsert({
    role: "assistant",
    content: message,
    conversationId,
    senderId: user.id,
    hasSeen: false,
    sid: result.sid,
  });

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Inital message sent!" };
};

export const smsCreate = async (values: z.infer<typeof SmsMessageSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const validatedFields = SmsMessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { conversationId, leadId, content, images, type } =
    validatedFields.data;

  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) {
    return { error: "Lead does not exist" };
  }

  let convoid = conversationId;
  let agentId = user.id;

  if (!convoid) {
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }
    const existingConversation = await db.conversation.findUnique({
      where: { leadId: lead.id },
    });
    if (existingConversation) {
      convoid = existingConversation.id;
    } else convoid = (await conversationInsert(agentId, lead.id)).success;
  }

  const result = await client.messages.create({
    from: lead.defaultNumber,
    to: lead.cellPhone || (lead.homePhone as string),
    mediaUrl: images ? [`https://hperioncrm.com${images}`] : undefined,
    body: content,
    applicationSid: cfg.twimlAppSid,
  });

  const newMessage = await messageInsert({
    role: "assistant",
    content,
    conversationId: convoid!,
    attachment: images,
    senderId: user.id,
    hasSeen: true,
  });

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: newMessage.success };
};

export const smsSend = async (
  fromPhone: string,
  toPhone: string,
  message: string,
  timer: number = 0
) => {
  if (!message) {
    return { error: "Message cannot be empty!" };
  }

  let result;

  if (timer > 900) {
    const date = new Date();
    date.setSeconds(date.getSeconds() + timer);
    result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
      messagingServiceSid: cfg.messageServiceSid,
      sendAt: date,
      scheduleType: "fixed",
    });
  } else {
    setTimeout(async () => {
      result = await client.messages.create({
        body: message,
        from: fromPhone,
        to: toPhone,
        applicationSid: cfg.twimlAppSid,
      });
    }, timer * 1000);
  }

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};

export const smsSendAgentAppointmentNotification = async (
  userId: string,
  lead: Lead,
  date: Date
) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      notificationSettings: {
        select: { appointments: true, phoneNumber: true },
      },
    },
  });
  if (!user) {
    return { error: "User Not Found!" };
  }

  if (!user.notificationSettings) {
    return { error: "Settings Not Found!" };
  }
  if (!user.notificationSettings.appointments) {
    return { error: "Appointment notifications not set!" };
  }
  if (!user.notificationSettings.phoneNumber) {
    return { error: "PhoneNumber not set!" };
  }

  const message = `Hi ${user.firstName},\nGreat news! ${lead.firstName} ${
    lead.lastName
  } has booked an appointment for ${format(date, hyperionDate)} at ${format(
    date,
    "hh:mm aa"
  )}. Be sure to prepare for the meeting and address any specific concerns the client may have mentioned. Let us know if you need any further assistance.\n\nBest regards,\nStrongside Financial`;

  const result = await smsSend(
    lead.defaultNumber,
    user.notificationSettings.phoneNumber,
    message
  );

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};

export const smsSendLeadAppointmentNotification = async (
  userId: string,
  lead: Lead,
  date: Date
) => {
  const message = `Hi ${
    lead.firstName
  },\nThanks for booking an appointment with us! Your meeting is confirmed for ${format(
    date,
    hyperionDate
  )} at ${format(
    date,
    "hh:mm aa"
  )}. Our team looks forward to discussing your life insurance needs. If you have any questions before the appointment, feel free to ask.\n\nBest regards,\nStrongside Financial
  `;

  const result = await smsSend(lead.defaultNumber, lead.cellPhone, message);

  const existingConversation = await db.conversation.findFirst({
    where: {
      lead: { id: lead.id },
    },
  });
  let convoid = existingConversation?.id;
  if (!convoid) {
    convoid = (await conversationInsert(userId, lead.id)).success;
  }
  const newMessage = await messageInsert({
    role: "assistant",
    content: message,
    conversationId: convoid!,
    senderId: userId,
    hasSeen: true,
  });

  if (!result.success) {
    return { error: "Message was not sent!" };
  }
  if (!newMessage.success) {
    return { error: newMessage.error };
  }

  return { success: newMessage.success };
};

export const smsSendAppointmentReminder = async (lead: Lead, date: Date) => {
  const message = `"Hi ${lead.firstName},\n Just a friendly reminder that your appointment with us is tomorrow! Please confirm if you'll still be able to make it. If you need to reschedule or have any questions, feel free to reach out.\nLooking forward to seeing you,\nStrongside Financial"
  `;

  const result = await smsSend(lead.defaultNumber, lead.cellPhone, message);

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};

export const smsSendNewHyperionLeadNotifications = async (
  lead: HyperionLead
) => {
  const message = `A new lead has been added hyperion:\n ${lead.firstName} ${lead.lastName}\n${lead.city}, ${lead.state},\n DOB: ${lead.dateOfBirth}.`;

  await smsSend("+18623527091", "+19177548025", message);
  await smsSend("+18624659687", "+13478030962", message);

  return { success: "Message sent!" };
};