import { db } from "@/lib/db";

import { NextResponse } from "next/server";

import { TwilioSms } from "@/types";
import { MessageSchemaType } from "@/schemas/message";

import { MessageType } from "@/types/message";

import {
  disabledAutoChatResponse,
  getKeywordResponse,
  smsSend,
  forwardTextToLead,
} from "@/actions/sms";

import { chatFetch } from "@/actions/gpt";

import { createAppointment } from "@/actions/appointment";
import { chatSettingGetTitan } from "@/actions/settings/chat";
import { createMessage, insertMessage } from "@/actions/lead/message";

import { formatDateTime } from "@/formulas/dates";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";
import { getOrCreateLeadByPhoneNumber } from "@/actions/lead";
import { LeadCommunicationType } from "@/types/lead";

export async function POST(req: Request) {
  //The paramters passed in from twilio
  const body = await req.formData();

  //Convert the body to Json paramaters
  const sms: TwilioSms = formatObject(body);

  //Find the agent number where this message is going to
  const agentNumber = await db.phoneNumber.findFirst({
    where: { phone: sms.to },
  });

  //if agent number doesn't exists return error
  if (!agentNumber)
    return new NextResponse("Agent number doesn't exists", { status: 500 });

  //Find the agent with this personal number - from number
  const agent = await db.phoneSettings.findFirst({
    where: { personalNumber: sms.from },
  });

  //TODO - neeed to reintergrate this functionality
  // if (agent && agentNumber?.agentId == agent.userId) {
  //   //Start Agent to Lead Message Process
  //   const insertedMessage = await forwardTextToLead(sms, agent.userId);
  //   if (insertedMessage) return new NextResponse(null, { status: 200 });
  // }

  //Get or create the lead infor based on the cellphone
  const lead = await getOrCreateLeadByPhoneNumber({
    cellPhone: sms.from,
    state: sms.fromState,
    agentId: agentNumber.agentId!,
  });

  //The incoming message from the lead
  const smsFromLead: MessageSchemaType = {
    id: sms.smsSid,
    role: "user",
    conversationId: "conversation.id",
    from: MessageType.LEAD,
    direction: "inbound",
    content: sms.body,
    hasSeen: false,
  };

  //Create a new message from the leads response
  const messageResult = await createMessage({
    ...smsFromLead,
    leadId: lead.id,
    agentId: agentNumber.agentId!,
  });

  smsFromLead.conversationId = messageResult.conversation.id;

  //Get Keyword Response based ont the leads text
  //If a reponse is generated end the flow and return a success message to the lead
  const keywordResponse = await getKeywordResponse(
    smsFromLead,
    sms,
    messageResult.conversation.id,
    messageResult.conversation.leadId
  );
  if (keywordResponse)
    return new NextResponse(keywordResponse, { status: 200 });

  //Check weather titan is enabled globally for this agent
  const titan = await chatSettingGetTitan(agentNumber?.agentId as string);
  //If titan is disabled
  if (!titan || !lead.titan) {
    await disabledAutoChatResponse(
      messageResult.conversation,
      messageResult.sms!
    );
    //exit the workflow
    return new NextResponse("Titan is turned off", { status: 200 });
  }

  //If autochat is enabled - get all the messages in the conversation
  const messages = await db.leadCommunication.findMany({
    where: { conversationId: messageResult.conversation.id,type:LeadCommunicationType.SMS },
  });

  //Convert all the messags into a list that chatGpt can read
  let chatMessages = messages.map((message) => {
    return { role: message.role, content: message.content };
  });

  //Add the current message from the lead
  chatMessages.push({ ...smsFromLead });

  //Send the conversation from chatGpt and return a response
  const chatResponse = await chatFetch(chatMessages);
  const { role, content } = chatResponse.choices[0].message;

  //If there is no response from chatGpt - exit the workflow
  if (!content)
    return new NextResponse("Thank you for your message", { status: 200 });

  //If the message from chatGpt includes the key word {schedule} - lets schedule an appointment
  if (content.includes("{schedule}")) {
    const aptDate = new Date(content.replace("{schedule}", "").trim());
    //TODO - need to calculate the agentDate (startDate) based on the agents timeZone
    await createAppointment({
      date: new Date(),
      localDate: aptDate,
      startDate: aptDate,
      leadId: messageResult.conversation.leadId,
      agentId: messageResult.conversation.agentId,
      labelId: "cm1nvphdz0000ycm71r4vidu0",
      comments: "",
      smsReminder: false,
      emailReminder: false,
    });

    const appointmentMessage = `Appointment has been schedule for ${formatDateTime(
      aptDate
    )}`;
    await smsSend({
      toPhone: sms.to,
      fromPhone: sms.from,
      message: appointmentMessage,
    });
    return new NextResponse(
      `Appointment has been schedule for ${formatDateTime(aptDate)}`,
      { status: 200 }
    );
  }
  //Wait 5 seconds before inserting the new message from chatGpt
  // const delay = Math.round(content.length / 35) * 8;
  const words = content.split(" ");
  const wpm = 38;
  const delay = Math.round(words.length / wpm);

  const results = await smsSend({
    toPhone: sms.from,
    fromPhone: sms.to,
    message: content,
    timer: delay,
  });

  if (!results.success) return new NextResponse(results.error, { status: 200 });

  //Insert the new message from chat gpt into the conversation
  const newChatMessage = await insertMessage({
    id: results.success,
    conversationId: messageResult.conversation.id,
    role,
    from: MessageType.TITAN,
    direction: "outbound",
    content,
    hasSeen: true,
  });
  if (newChatMessage) {
    await db.leadConversation.update({
      where: { id: messageResult.conversation.id },
      include: { lastCommunication: true, lead: true },
      data: {
        lastCommunicationId: newChatMessage.id,
      },
    });
    //TODO need to reintegrate this withing the server
    // sendSocketData(
    //   messageResult.conversation.agentId,
    //   "conversation:updated",
    //   updatedConversation
    // );

    sendSocketData(
      messageResult.conversation.agentId,
      "conversation-messages:new",
      [messageResult.sms, newChatMessage]
    );
  }
  return new NextResponse(content, { status: 200 });
}
