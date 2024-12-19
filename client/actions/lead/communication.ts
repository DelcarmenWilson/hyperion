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

export const getCommunicationForConversation = async (
  conversationId: string | null | undefined
) => {
  if (!conversationId) throw new Error("ConversationId was not supplied!!");
  const user = currentUser();
  if (!user) throw new Error("Unauthenticated!");
  return await db.leadCommunication.findMany({
    where: { conversationId, role: { not: "system" } },
    orderBy: { createdAt: "asc" },
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
    role: "system",
    content: prompt,
    conversationId,
    from: MessageType.AGENT,
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
    from: MessageType.TITAN,
    senderId: user.id,
    hasSeen: true,
    sid: result.success,
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

  const newMessage = await insertMessage({
    role: "assistant",
    content: data.content,
    conversationId: convoid!,
    from: MessageType.AGENT,
    attachment: data.images,
    senderId: user.id,
    hasSeen: true,
  });

  if (!result) throw new Error("Message was not sent!");

  return newMessage;
};
export const insertMessage = async (values: MessageSchemaType) => {
  const { success, data } = MessageSchema.safeParse(values);
  if (!success) throw new Error("Invalid fields!");
  const conversation = await db.leadConversation.findUnique({
    where: { id: data.conversationId },
  });

  if (!conversation) throw new Error("Conversation does not exists!");

  const newMessage = await db.leadCommunication.create({
    data: {
      ...data,
    },
  });

  await db.leadConversation.update({
    where: { id: data.conversationId },
    data: {
      lastCommunicationId: newMessage.id,
      unread:
        conversation.leadId == data.senderId ? conversation.unread + 1 : 0,
    },
  });

  return newMessage;
};


//TODO - please remove this action after we run only once

export const createConversationForCalls = async () => {
  const calls = await db.leadCommunication.findMany({
    where: { conversationId: undefined, leadId: { not: undefined } },
  });

  if (!calls) return { error: "No calls to convert" };

  const conversationsToCreate: { agentId: string; leadId: string }[] = [];

  for (const call of calls) {
    if(call.leadId==null) continue
    const exists = conversationsToCreate.find(
      (e) => e.agentId == call.userId && e.leadId == call.leadId
    );
    if (!exists) {
      conversationsToCreate.push({
        agentId: call.userId as string,
        leadId: call.leadId as string,
      });
    }
  }
  
  await db.leadConversation.createMany({
    data: conversationsToCreate,
    skipDuplicates: true,
  });

  return { success: "Eveything went well" };
};

export const assignLastCommunicationId=async()=>{
const conversations=await db.leadConversation.findMany({where:{lastCommunicationId:undefined},select:{id:true}})
if(!conversations.length) return {error:"No conversations available"}
for (const convo of conversations) {
  const first=await db.leadCommunication.findFirst({where:{conversationId:convo.id},orderBy:{createdAt:"asc"}})
  const last=await db.leadCommunication.findFirst({where:{conversationId:convo.id},orderBy:{createdAt:"desc"}})
  
  if(!first || !last)continue

  await db.leadConversation.update({where:{id:convo.id},data:{
    createdAt:first.createdAt,
    updatedAt:last.createdAt,
    lastCommunicationId:last.id ,
  }})
}
return {success:"Everything went well"}

}