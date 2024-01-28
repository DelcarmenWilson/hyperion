"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import twilio from "twilio";

import { conversationInsert } from "./conversation";
import { messageInsert } from "./message";
import {
  defaultChat,
  defaultOptOut,
} from "@/placeholder/chat";
import { cfg } from "@/lib/twilio-config";
import { replacePreset } from "@/formulas/text";
import { getRandomNumber } from "@/formulas/numbers";

export const sendIntialSms = async (leadId: string) => {
  //TODO the entire lead shall be passed
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

  prompt = replacePreset(prompt, user.name!, lead);
  message = replacePreset(message, user.name!, lead);

  if (chatSettings?.leadInfo) {
    prompt += `Here is the lead information: ${JSON.stringify(lead)}  `;
  }

  const conversation = await conversationInsert(user.id, lead.id);

  if (!conversation.success) {
    return { error: "Conversation was not created" };
  }

  await messageInsert(
    { role: "system", content: prompt },
    conversation.success
  );

  await messageInsert({ role: "user", content: message }, conversation.success);

  // message +=`${"\n\n"} ${defaultOptOut}`
  const client = twilio(cfg.accountSid, cfg.apiToken);
  const result = await client.messages.create({
    body: message,
    from: cfg.callerId,
    to: lead.cellPhone || (lead.homePhone as string),
  });

  if (!result) {
    return { error: "Message was not sent!" };
  }

  return { success: "Inital message sent!" };
};


