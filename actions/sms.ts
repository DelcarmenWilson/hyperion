"use server";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { conversationInsert } from "./conversation";
import { messageInsert } from "./message";
import { defaultChat, defaultOptOut } from "@/placeholder/chat";
import { replacePreset } from "@/formulas/text";
import { getRandomNumber } from "@/formulas/numbers";
import { cfg, client } from "@/lib/twilio-config";

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

  const conversationId = (await conversationInsert(user.id, lead.id)).success;

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

export const smsCreate = async (leadId: string, message: string) => {
  const user = await currentUser();
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
  let convoid = existingConversation?.id;
  if (!convoid) {
    convoid = (await conversationInsert(user.id, lead.id)).success;
  }

  await messageInsert({
    role: "assistant",
    content: message,
    conversationId: convoid!,
    senderId: user.id,
    hasSeen: false,
  });

  const result = await client.messages.create({
    body: message,
    from: lead.defaultNumber,
    to: lead.cellPhone || (lead.homePhone as string),
  });

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};

export const smsSend = async (
  fromPhone: string,
  toPhone: string,
  message: string
) => {
  if (!message) {
    return { error: "Message cannot be empty!" };
  }

  const result = await client.messages.create({
    body: message,
    from: fromPhone,
    to: toPhone,
  });

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Message sent!" };
};
