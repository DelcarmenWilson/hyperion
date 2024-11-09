"use server";

import { db } from "@/lib/db";

import { cfg, client } from "@/lib/twilio/config";

import { LeadDefaultStatus } from "@/types/lead";
import { LeadAndConversation, TwilioSms } from "@/types";
import { HyperionLead, Lead, LeadMessage } from "@prisma/client";
import { MessageSchemaType } from "@/schemas/message";

import { messageInsert } from "./lead/message";
import { conversationInsert } from "./lead/conversation";
import {
  formatDateTimeZone,
  formatHyperionDate,
  formatTimeZone,
} from "@/formulas/dates";
import { sendSocketData } from "@/services/socket-service";
import { defaultOptOut } from "@/placeholder/chat";

export const smsSend = async ({
  fromPhone,
  toPhone,
  message,
  media,
  timer = 0,
}: {
  fromPhone: string;
  toPhone: string;
  message: string;
  media?: string | undefined;
  timer?: number;
}) => {
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
      mediaUrl: media ? [media] : undefined,
      sendAt: date,
      scheduleType: "fixed",
    });
  } else {
    //TODO need to implement the timer again
    // setTimeout(async () => {
    result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
      mediaUrl: media ? [media] : undefined,
      applicationSid: cfg.twimlAppSid,
    });
    // }, timer * 1000);
  }

  if (!result) return { error: "Message was not sent!" };

  return { success: result.sid, message: "Message sent!" };
};

export const smsSendAgentAppointmentNotification = async (
  userId: string,
  lead: Lead | null | undefined,
  date: Date
) => {
  if (!lead) {
    return { error: "Lead Info requiered" };
  }
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      notificationSettings: {
        select: { appointments: true },
      },
      phoneSettings: { select: { personalNumber: true } },
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
  if (!user.phoneSettings?.personalNumber) {
    return { error: "PhoneNumber not set!" };
  }
  //TODO - dont forget to remap the agents timezone here

  const message = `Hi ${user.firstName},\nGreat news! ${lead.firstName} ${
    lead.lastName
  } has booked an appointment for ${formatDateTimeZone(
    date
  )} at ${formatTimeZone(
    date
  )}. Be sure to prepare for the meeting and address any specific concerns the client may have mentioned. Let us know if you need any further assistance.\n\nBest regards,\nStrongside Financial`;

  const result = await smsSend({
    fromPhone: lead.defaultNumber,
    toPhone: user.phoneSettings.personalNumber,
    message,
  });

  if (!result.success) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};

export const smsSendLeadAppointmentNotification = async (
  userId: string,
  lead: Lead | null | undefined,
  date: Date
) => {
  if (!lead) {
    return { error: "Lead Info requiered" };
  }
  //TODO - update does not go as planned tommorrow - change this back to use the default time ln.292
  //const timeZone=states.find(e=>e.abv.toLocaleLowerCase()==lead.state.toLocaleLowerCase())?.zone || "US/Eastern"
  const message = `Hi ${
    lead.firstName
  },\nThanks for booking an appointment with us! Your meeting is confirmed for ${formatHyperionDate(
    date
  )} at ${formatTimeZone(
    date
  )}. Our team looks forward to discussing your life insurance needs. If you have any questions before the appointment, feel free to ask.\n\nBest regards,\nStrongside Financial
  `;

  const result = await smsSend({
    fromPhone: lead.defaultNumber,
    toPhone: lead.cellPhone,
    message,
  });

  const existingConversation = await db.leadConversation.findFirst({
    where: {
      lead: { id: lead.id },
    },
  });
  let convoid = existingConversation?.id;
  if (!convoid) {
    convoid = (await conversationInsert(userId, lead.id)).success;
  }

  if (!result.success) {
    return { error: "Message was not sent!" };
  }
  const newMessage = await messageInsert({
    role: "assistant",
    content: message,
    conversationId: convoid!,
    senderId: userId,
    hasSeen: true,
    sid: result.success,
  });
  if (!newMessage.success) {
    return { error: newMessage.error };
  }

  return { success: newMessage.success };
};

export const smsSendLeadAppointmentReminder = async (
  lead: Lead,
  minutes: number
) => {
  // const message = `"Hi ${lead.firstName},\n Just a friendly reminder that your appointment with us is tomorrow! Please confirm if you'll still be able to make it. If you need to reschedule or have any questions, feel free to reach out.\nLooking forward to seeing you,\nStrongside Financial"
  // `;

  const message = `Hi ${lead.firstName},\n Just a friendly reminder that your appointment with us is in about ${minutes} minutes! Please confirm if you'll still be able to make it. If you need to reschedule or have any questions, feel free to reach out.\nLooking forward to talking with you,\nStrongside Financial  `;

  const result = await smsSend({
    fromPhone: lead.defaultNumber,
    toPhone: lead.cellPhone,
    message,
  });

  if (!result.success) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};

// export const smsSendAppointmentReminder = async (lead: Lead, date: Date) => {
//   const message = `"Hi ${lead.firstName},\n Just a friendly reminder that your appointment with us is tomorrow! Please confirm if you'll still be able to make it. If you need to reschedule or have any questions, feel free to reach out.\nLooking forward to seeing you,\nStrongside Financial"
//   `;

//   const result = await smsSend(lead.defaultNumber, lead.cellPhone, message);

//   if (!result) {
//     return { error: "Message was not sent!" };
//   }

//   return { success: "Message sent!" };
// };

export const smsSendNewHyperionLeadNotifications = async (
  lead: HyperionLead
) => {
  const message = `A new lead has been added hyperion:\n ${lead.firstName} ${lead.lastName}\n${lead.city}, ${lead.state},\n DOB: ${lead.dateOfBirth}.`;

  // await smsSend("+18623527091", "+19177548025", message);
  await smsSend({
    fromPhone: "+18624659687",
    toPhone: "+13478030962",
    message,
  });

  return { success: "Message sent!" };
};

///TWILIO ROUTES FUNCTIONS

//Returns a key word responsed based on the text message recieved
export const getKeywordResponse = async (
  smsFromLead: MessageSchemaType,
  sms: TwilioSms,
  conversationId: string,
  leadId: string
) => {
  switch (smsFromLead.content.toLowerCase()) {
    case "stop":
    case "cancel":
      await db.lead.update({
        where: { id: leadId },
        data: { statusId:LeadDefaultStatus.DONOTCALL },
      });
      await smsSend({
        toPhone: sms.to,
        fromPhone: sms.from,
        message: defaultOptOut.confirm,
      });

      return defaultOptOut.confirm;
    case "reset":
      await db.leadConversation.delete({ where: { id: conversationId } });
      await smsSend({
        toPhone: sms.to,
        fromPhone: sms.from,
        message: "Conversation has been reset",
      });
      return "Conversation has been reset";
    default:
      return null;
  }

  return null;
};
// Reponse when the autoChat is turned off
export const disabledAutoChatResponse = async (
  conversation: LeadAndConversation,
  message: LeadMessage | undefined
) => {
  const updatedConversation = await db.leadConversation.update({
    where: { id: conversation.id },
    include: { lastMessage: true, lead: true },
    data: {
      lastMessageId: message?.id,
    },
  });
  const lead = conversation.lead;
  const settings = await db.notificationSettings.findUnique({
    where: { userId: lead.userId },
  });
  const phoneSettings = await db.phoneSettings.findUnique({
    where: { userId: lead.userId },
  });

  if (settings?.textForward && phoneSettings?.personalNumber) {
    const agentMessage = `${lead.firstName} ${lead.lastName} - ${lead.textCode}: \n${message?.content}`;
    await smsSend({
      toPhone: phoneSettings.personalNumber,
      fromPhone: lead.defaultNumber,
      message: agentMessage,
    });
  }
  sendSocketData(
    conversation.agentId,
    "conversation:updated",
    updatedConversation
  );

  sendSocketData(conversation.agentId, "conversation-messages:new", [message]);
};

//FORWARD TEXT MESSAGE TO LEAD

export const forwardTextToLead = async (sms: TwilioSms, agentId: string) => {
  const message = sms.body.split("-");
  if (message.length == 1) {
    return { error: "Message nrequiered!" };
  }
  const lead = await db.lead.findFirst({ where: { textCode: message[0] } });
  if (!lead) {
    return { error: "Lead does not exist!" };
  }
  const conversation = await db.leadConversation.findFirst({
    where: { leadId: lead.id, agentId },
  });
  if (!conversation) {
    return { error: "Conversation does not exist!" };
  }

  //Send Message to lead
  const sid = (
    await smsSend({
      toPhone: sms.to,
      fromPhone: lead.cellPhone,
      message: message[1],
    })
  ).success;

  //Update Messages And conversation
  const insertedMessage = (
    await messageInsert({
      role: "user",
      content: message[1],
      conversationId: conversation.id,
      senderId: agentId,
      hasSeen: true,
      sid: sid,
    })
  ).success;

  return insertedMessage;
};
