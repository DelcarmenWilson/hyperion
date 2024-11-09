"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import {
  MessageSchema,
  MessageSchemaType,
  SmsMessageSchema,
  SmsMessageSchemaType,
} from "@/schemas/message";

import { conversationInsert } from "./conversation";
import { smsSend } from "../sms";
import { userGetByAssistantOld } from "@/data/user";

import { defaultChat, defaultOptOut } from "@/placeholder/chat";
import { getRandomNumber } from "@/formulas/numbers";
import { replacePreset } from "@/formulas/text";

// ACTIONS
export const messagesGetAllByConversationId = async (
  conversationId: string | null | undefined
) => {
  if (!conversationId) return [];
  const user = currentUser();
  if (!user) return [];
  const messages = await db.leadMessage.findMany({
    where: { conversationId, role: { not: "system" } },
  });
  return messages;
};

export const messageCreateInitial = async (
  leadId: string | null | undefined
) => {
  if (!leadId)
    return {
      error: "Lead was not supplied!",
    };

  const dbuser = await currentUser();
  //if user is not logged in, then return unathorized
  if (!dbuser) 
    return { error: "Unauthenticated" };  

  //retrieve user data from database and include the team
  const user = await db.user.findUnique({
    where: { id: dbuser.id },
    include: { team: true },
  });

  //if  user does not exist return unauthorized
  if (!user) 
    return { error: "Unauthorized" };  

  //retrieve lead info from the database
  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) 
    return { error: "Lead does not exist" };
  
  //retrieve existing conversation with the lead
  const existingConversation = await db.leadConversation.findFirst({
    where: {
      lead: { id: lead.id },
    },
  });

  //ensure that the conversation dost not exists
  if (existingConversation) return { error: "Conversation Already exist" };

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
  const conversationId = (await conversationInsert(user.id, lead.id)).success;

  //ensure that the conversation was created
  if (!conversationId) return { error: "Conversation was not created" };

  //insert the prompt into the conversation- the first message will have a role of system. this tells chat gpt to use this as a prompt
  await messageInsert({
    role: "system",
    content: prompt,
    conversationId,
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
  if (!result.success) return { error: result.error };

  //insert the initial message into the conversation
  await messageInsert({
    role: "assistant",
    content: message,
    conversationId,
    senderId: user.id,
    hasSeen: true,
    sid: result.success,
  });

  return { success: conversationId };
};

export const messageCreate = async (values: SmsMessageSchemaType) => {
  const user = await currentUser();
  if (!user?.id)  return { error: "Unathenticated!" };

  const validatedFields = SmsMessageSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { conversationId, leadId, content, images, type } =
    validatedFields.data;

  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) return { error: "Lead does not exist" };

  let convoid = conversationId;
  let agentId = user.id;

  if (!convoid) {
    if (user.role == "ASSISTANT")
      agentId = (await userGetByAssistantOld(user.id)) as string;

    const existingConversation = await db.leadConversation.findUnique({
      where: { leadId_agentId: { leadId: lead.id, agentId } },
    });
    if (existingConversation) {
      convoid = existingConversation.id;
    } else convoid = (await conversationInsert(agentId, lead.id)).success;
  }

  const result = await smsSend({
    fromPhone: lead.defaultNumber,
    toPhone: lead.cellPhone || (lead.homePhone as string),
    media: images,
    message: content,
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

export const messageInsert = async (values: MessageSchemaType) => {
  const validatedFields = MessageSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { role, content, conversationId, attachment, senderId, hasSeen, sid } =
    validatedFields.data;

  const conversation = await db.leadConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return { error: "Conversation does not exists!" };
  }

  const newMessage = await db.leadMessage.create({
    data: {
      conversationId,
      role,
      content,
      attachment,
      hasSeen,
      senderId,
      sid,
    },
  });

  await db.leadConversation.update({
    where: { id: conversationId },
    data: {
      lastMessageId: newMessage.id,
      unread: conversation.leadId == senderId ? conversation.unread + 1 : 0,
    },
  });

  return { success: newMessage };
};
