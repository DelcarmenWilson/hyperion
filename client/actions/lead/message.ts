"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { MessageType } from "@/types/message";
import { SmsMessageSchema, SmsMessageSchemaType } from "@/schemas/message";

import { MessageSchema, MessageSchemaType } from "@/schemas/message";

import { createConversation } from "./conversation";
import { smsSend } from "../sms";
import { userGetByAssistantOld } from "@/data/user";

import { defaultChat } from "@/placeholder/chat";
import { getRandomNumber } from "@/formulas/numbers";
import { replacePreset } from "@/formulas/text";
import { randomUUID } from "crypto";
import { LeadCommunicationType } from "@/types/lead";
//TODO - this has to be removed before we get rid of all the tables and actions
export const getMessagesForConversation = async (
  conversationId: string | null | undefined
) => {
  if (!conversationId) throw new Error("ConversationId was not supplied!!");
  const user = currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.leadCommunication.findMany({
    where: { conversationId, role: { not: "system" } , type:LeadCommunicationType.SMS},
  });
};

export const createInitialMessage = async (
  leadId: string | null | undefined
) => {
  if (!leadId) throw new Error("Lead was not supplied!");

  const dbuser = await currentUser();
  //if user is not logged in, then return unauthorized
  if (!dbuser) throw new Error("Unauthenticated!");

  //retrieve user data from database and include the team
  const user = await db.user.findUnique({
    where: { id: dbuser.id },
    include: { team: true },
  });

  //if  user does not exist return unauthorized
  if (!user) throw new Error("Unauthenticated!");

  //retrieve lead info from the database
  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) throw new Error("Lead does not exist!");

  //retrieve existing conversation with the lead
  const existingConversation = await db.leadConversation.findFirst({
    where: {
      lead: { id: lead.id },
    },
  });

  //ensure that the conversation dost not exists
  if (existingConversation) throw new Error("Conversation Already exists!");

  //get all the preset text from this users account and return a random one
  const presets = await db.presets.findMany({
    where: { agentId: user.id, type: "Text" },
  });
  const rnd = getRandomNumber(0, presets.length);
  const preset = presets[rnd];

  //get the chatsettings for the user
  const chatSettings = await db.chatSettings.findUnique({
    where: { userId: user.id },
  });

  //if the user doesnt not have a prompt use the hyperion's default prompt
  let prompt = chatSettings?.defaultPrompt
    ? chatSettings?.defaultPrompt
    : defaultChat.prompt;

  //if the user doesnt not have any presetText use the hyperion's default message
  let message = preset ? preset.content : defaultChat.message;

  //replace the prompt and message variable content with the lead an user information
  prompt = replacePreset(prompt, user, lead);
  message = replacePreset(message, user, lead);
  //message += ` ${defaultOptOut.request}`;

  //include the lead info and add it to the end of prompt
  const leadInfo = {
    "first Name": lead.firstName,
    "last Name": lead.lastName,
    "Date Of Birth": lead.dateOfBirth,
    city: lead.city,
    state: lead.state,
  };

  prompt += `Todays Date is ${new Date()}. When you're poised to arrange an appointment, signify with the keyword {schedule}, alongside the designated date and time in UTC format. Here is my information: ${JSON.stringify(
    leadInfo
  )}  `;

  //create a new conversation between the agent and lead.
  const conversationId = await createConversation(user.id, lead.id);

  //ensure that the conversation was created
  if (!conversationId) throw new Error("Conversation was not created!");

  //insert the prompt into the conversation- the first message will have a role of system. this tells chat gpt to use this as a prompt
  await insertMessage({
    id:randomUUID(),
    conversationId,
    from: MessageType.AGENT,
    direction:"outbound",
    content: prompt,
    role: "system",
    hasSeen: true,
  });

  //send the message to the lead via sms and await the response
  const result = await smsSend({
    message,
    fromPhone: lead.defaultNumber,
    toPhone: lead.cellPhone || (lead.homePhone as string),
  });

  //return an error if the sms was not sent
  if (!result.success) throw new Error(result.error);

  //insert the initial message into the conversation
  await insertMessage({
    id: result.success,
    conversationId,
    role: "assistant",
    from: MessageType.TITAN,
    direction:"outbound",
    content: message,
    hasSeen: true,
  });

  return conversationId;
};

export const createNewMessage = async (values: SmsMessageSchemaType) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated!");

  const { success, data } = SmsMessageSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");

  const lead = await db.lead.findUnique({ where: { id: data.leadId } });

  if (!lead) throw new Error("Lead does not exist!");
  let convoid = data.conversationId;
  let agentId = user.id;

  if (!convoid) {
    if (user.role == "ASSISTANT")
      agentId = (await userGetByAssistantOld(user.id)) as string;

    const existingConversation = await db.leadConversation.findUnique({
      where: { leadId_agentId: { leadId: lead.id, agentId } },
    });
    if (existingConversation) {
      convoid = existingConversation.id;
    } else convoid = await createConversation(agentId, lead.id);
  }

  const result = await smsSend({
    fromPhone: lead.defaultNumber,
    toPhone: lead.cellPhone || (lead.homePhone as string),
    media: data.images,
    message: data.content,
  });

  if (!result.success) throw new Error("Message was not sent!");

  const newMessage = await insertMessage({
    id:result.success,
    conversationId: convoid!,
    role: "assistant",
    from: MessageType.AGENT,
    direction:"outbound",
    content: data.content,
    attachment: data.images,
    hasSeen: true,
  });

  

  return newMessage;
};

export const insertMessage = async (values: MessageSchemaType) => {
  const { success, data } = MessageSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");
  const conversation = await db.leadConversation.findUnique({
    where: { id: data.conversationId },
  });

  if (!conversation) throw new Error("Conversation does not exists!");
  
   const updatedConversation=await db.leadConversation.update({
      where: { id: data.conversationId },select:{lastCommunication:true},
    
      data: {
        lastCommunication:{create:{
          ...data,
          type: LeadCommunicationType.SMS,
        }},
        unread: { increment: data.direction == "inbound" ? 1 : 0 },
      },
    });



    return updatedConversation.lastCommunication;
};
