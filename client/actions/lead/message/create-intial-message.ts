"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { MessageType } from "@/types/message";

import { createConversation } from "../conversation/create-conversation";
import { smsSend } from "../../sms";
import { insertMessage } from "./insert-message";

import { defaultChat } from "@/placeholder/chat";
import { getRandomNumber } from "@/formulas/numbers";
import { replacePreset } from "@/formulas/text";

export const createInitialMessage = async (
  leadId: string | null | undefined
) => {
  if (!leadId) throw new Error("Lead was not supplied!");

  const dbuser = await currentUser();
  //if user is not logged in, then return unathorized
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
    role: "system",
    content: prompt,
    conversationId,
    type: MessageType.AGENT,
    senderId: user.id,
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
    role: "assistant",
    content: message,
    conversationId,
    type: MessageType.TITAN,
    senderId: user.id,
    hasSeen: true,
    sid: result.success,
  });

  return   conversationId ;
};