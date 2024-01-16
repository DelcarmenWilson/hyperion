"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import twilio from "twilio";
import { conversationInsert } from "./conversation";
import { messageInsert } from "./message";
import { defaultMessage, defaultOptOut, defaultPrompt } from "@/placeholder/chat";

const sid = process.env.TWILIO_CLIENT_ID;
const token = process.env.TWILIO_CLIENT_TOKEN;
const from = process.env.TWILIO_PHONE;

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

  const chatSettings = await db.chatSettings.findUnique({
    where: { userId: user.id },
  });

  let prompt = chatSettings?.initialPrompt
    ? chatSettings.initialPrompt
    : defaultPrompt().replace("{AGENT_NAME}", user.name as string);

  let message = chatSettings?.initialMessage
    ? chatSettings.initialMessage
    : defaultMessage().replace("{AGENT_NAME}", user.name as string);
  message = message.replace("{LEAD_NAME}", lead.firstName as string);

  if (chatSettings?.leadInfo) {
    prompt += `Here is the lead information: ${JSON.stringify(lead)}  `;
  } 

  const conversation = await conversationInsert(user.id, lead.id, message);

  if (!conversation.success) {
    return { error: "Conversation was not created" };
  }

  await messageInsert(
    { role: "system", content: prompt },
    conversation.success
  );

  await messageInsert(
    { role: "user", content: message },
    conversation.success
  );

  message +=`${"\n\n"} ${defaultOptOut}`
  const client = twilio(sid, token);
  const result = await client.messages.create({
    body: message,
    from: from,
    to: lead.cellPhone || (lead.homePhone as string),
  });

  if (!result) {
    return { success: "Message was not sent!" };
  }

  return { success: "Inital message sent!" };
};
