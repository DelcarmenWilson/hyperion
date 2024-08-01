"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import axios from "axios";

import { cfg, client } from "@/lib/twilio/config";

import { LeadAndConversation, TwilioSms } from "@/types";
import { HyperionLead, Lead, Message } from "@prisma/client";
import { MessageSchemaType, SmsMessageSchema,SmsMessageSchemaType } from "@/schemas/message";

import { messageInsert } from "./message";
import { conversationInsert } from "./conversation";
import { userGetByAssistant } from "@/data/user";

import { defaultChat, defaultOptOut } from "@/placeholder/chat";
import { getRandomNumber } from "@/formulas/numbers";
import { replacePreset } from "@/formulas/text";
import { formatDateTimeZone, formatHyperionDate, formatTimeZone } from "@/formulas/dates";

export const smsCreateInitial = async (leadId: string) => {
  const dbuser = await currentUser();
  if (!dbuser) {
    return { error: "Unauthenticated" };
  }

  //retrieve user data from database and include the team
  const user = await db.user.findUnique({ 
    where: { id: dbuser.id },
    include:{team:true}   
  });

  //if  user does not exist return unauthorized
  if (!user) {
    return { error: "Unauthorized" };
  }

  //retrieve lead info from the database
  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) {
    return { error: "Lead does not exist" };
  }
 //retrieve existing conversation with the lead
  const existingConversation = await db.conversation.findFirst({
    where: {
      lead: { id: lead.id },
    },
  });

  //ensure that the conversation dost not exists
  if (existingConversation) {
    return { error: "Conversation Already exist" };
  }

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

    prompt += `Todays Date is ${new Date()}. When you're poised to arrange an appointment, signify with the keword {schedule}, alongside the designated date and time in UTC format. Here is my information: ${JSON.stringify(
      leadInfo
    )}  `;
 

  //create a new conversation between the agent and lead.
  const conversationId = (await conversationInsert(user.id, lead.id, chatSettings?.autoChat))
    .success;

    //ensure that the conversationw as created
  if (!conversationId) {
    return { error: "Conversation was not created" };
  }

  //insert the prompt into the conversation- the first message will have a role of system. this tells chat gpt to use this as a prompt
  await messageInsert({
    role: "system",
    content: prompt,
    conversationId,
    senderId: user.id,
    hasSeen: false,
  });
//send the message to the lead via sms and await the response
  const result = await client.messages.create({
    body: message,
    from: lead.defaultNumber,
    to: lead.cellPhone || (lead.homePhone as string),
    applicationSid: cfg.twimlAppSid,
  });
//insert the initial message into the conversation
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

export const smsCreate = async (values: SmsMessageSchemaType) => {
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
      where: { leadId_agentId:{leadId: lead.id ,agentId}},
    });
    if (existingConversation) {
      convoid = existingConversation.id;
    } else convoid = (await conversationInsert(agentId, lead.id)).success;
  }

  const result = await client.messages.create({
    from: lead.defaultNumber,
    to: lead.cellPhone || (lead.homePhone as string),
    mediaUrl: images ? [images] : undefined,
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

  return { success:result.sid,message:"Message sent!"  };
};

export const smsSendAgentAppointmentNotification = async (
  userId: string,
  lead: Lead | null | undefined,
  date: Date
) => {
  if(!lead){
    return {error:"Lead Info requiered"}
  }
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
//TODO - dont forget to remap the agents timezone here

   //TODO - update does not go as planned tommorrow - change this back to use the default time ln.264
  const message = `Hi ${user.firstName},\nGreat news! ${lead.firstName} ${
    lead.lastName
  } has booked an appointment for ${formatDateTimeZone(date)} at ${formatTimeZone(
    date
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
  lead: Lead|null|undefined,
  date: Date
) => {
  if(!lead){
    return {error:"Lead Info requiered"}
  }
   //TODO - update does not go as planned tommorrow - change this back to use the default time ln.292
  //const timeZone=states.find(e=>e.abv.toLocaleLowerCase()==lead.state.toLocaleLowerCase())?.zone || "US/Eastern"
  const message = `Hi ${
    lead.firstName
  },\nThanks for booking an appointment with us! Your meeting is confirmed for ${formatHyperionDate(
    date   
      )} at ${formatTimeZone(
    date)}. Our team looks forward to discussing your life insurance needs. If you have any questions before the appointment, feel free to ask.\n\nBest regards,\nStrongside Financial
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
 

  if (!result.success) {
    return { error: "Message was not sent!" };
  }
  const newMessage = await messageInsert({
    role: "assistant",
    content: message,
    conversationId: convoid!,
    senderId: userId,
    hasSeen: true,
    sid:result.success
  });
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


///TWILIO ROUTES FUNCTIONS

//Returns a key word responsed based on the text message recieved
export const getKeywordResponse = async (
  smsFromLead: MessageSchemaType,
  sms: TwilioSms,
  conversationId:string,
  leadId:string
  
) => {
  switch (smsFromLead.content.toLowerCase()) {
    case "stop":
    case "cancel":
      await db.lead.update({
        where: { id:leadId },
        data: { status: "Do_Not_Call" },
      });
      await smsSend(sms.to, sms.from, defaultOptOut.confirm);
      return defaultOptOut.confirm;
    case "reset":
      await db.conversation.delete({ where: { id:   conversationId } });
      await smsSend(sms.to, sms.from, "Conversation has been reset");
      return "Conversation has been reset";
  }
  
  
  return null;
};
// Reponse when the autoChat is turned off
export const disabledAutoChatResponse=async(conversation:LeadAndConversation,message:Message | undefined)=>{
  const updatedConversation= await db.conversation.update({
    where: { id: conversation.id },include:{lastMessage:true,lead:true},
    data: {
      lastMessageId: message?.id,
    },
  });
  const lead=conversation.lead
  const settings=await db.notificationSettings.findUnique({where:{userId:lead.userId}})

  
  if(settings?.textForward && settings.phoneNumber){    
    const agentMessage=`${lead.firstName} ${lead.lastName} - ${lead.textCode}: \n${message?.content}`
    await smsSend(lead.defaultNumber,settings.phoneNumber,agentMessage)
  }
  axios.post("http://localhost:4000/socket", {
    userId: conversation.agentId,
    type: "conversation:updated",
    dt: updatedConversation,
  });
  axios.post("http://localhost:4000/socket", {
    userId: conversation.agentId,
    type: "conversation-messages:new",
    dt: [message],
  });
}

//FORWARD TEXT MESSAGE TO LEAD

export const forwardTextToLead=async(sms:TwilioSms,agentId:string)=>{

  const message= sms.body.split("-")
  if(message.length==1){
    return {error:"Message nrequiered!"}
  }
const lead=await db.lead.findFirst({where:{textCode:message[0]}})
if(!lead){
  return {error:"Lead does not exist!"}
}
const conversation=await db.conversation.findFirst({where:{leadId:lead.id,agentId}})
if(!conversation){
  return {error:"Conversation does not exist!"}
}

//Send Message to lead
const sid=(await smsSend(sms.to, lead.cellPhone, message[1])).success 


//Update Messages And conversation
const insertedMessage=(await messageInsert(
  { role: "user" ,
     content: message[1],
      conversationId: conversation.id,
       senderId: agentId,
      hasSeen: true,
        sid:sid}
)).success



}