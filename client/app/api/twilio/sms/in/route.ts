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
import { insertMessage } from "@/actions/lead/message/insert-message";

import { formatDateTime } from "@/formulas/dates";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";

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

  let updatedConversation;
  //Pulling the entire conversation based on the phone number
  const conversation = await db.leadConversation.findFirst({
    where: {
      lead: {
        cellPhone: sms.from,
      },
      agentId: agentNumber.agentId!,
    },
    include: { lead: true },
  });

  //If the conversation does not exist - exit the work flow
  if (!conversation)
    //TODO - create a new lead into a temp lead table
    return new NextResponse(null, { status: 200 });

  //The incoming message from the lead
  const smsFromLead: MessageSchemaType = {
    role: "user",
    type: MessageType.LEAD,
    content: sms.body,
    conversationId: conversation.id,
    senderId: conversation.leadId,
    hasSeen: false,
    sid: sms.smsSid,
  };

  //Create a new message from the leads response
  const newMessage = await insertMessage(smsFromLead);

  //Get Keyword Response based ont the leads text
  //If a reponse is generated end the flow and return a success message to the lead
  const keywordResponse = await getKeywordResponse(
    smsFromLead,
    sms,
    conversation.id,
    conversation.leadId
  );
  if (keywordResponse)
    return new NextResponse(keywordResponse, { status: 200 });

  //Check weather titan is enabled globally for this agent
  const titan = await chatSettingGetTitan(agentNumber?.agentId as string);
  //If titan is disabled
  if (!titan || !conversation.lead.titan) {
    await disabledAutoChatResponse(conversation, newMessage);
    //exit the workflow
    return new NextResponse("Titan is turned off", { status: 200 });
  }

  //If autochat is enabled - get all the messages in the conversation
  const messages = await db.leadMessage.findMany({
    where: { conversationId: conversation.id },
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
      leadId: conversation.leadId,
      agentId: conversation.agentId,
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
  const sid = (
    await smsSend({
      toPhone: sms.from,
      fromPhone: sms.to,
      message: content,
      timer: delay,
    })
  ).success;

  //Insert the new message from chat gpt into the conversation
  const newChatMessage = await insertMessage({
    role,
    content,
    type: MessageType.TITAN,
    conversationId: conversation.id,
    senderId: conversation.agentId,
    hasSeen: true,
    sid,
  });
  if (newChatMessage) {
    updatedConversation = await db.leadConversation.update({
      where: { id: conversation.id },
      include: { lastMessage: true, lead: true },
      data: {
        lastMessageId: newChatMessage.id,
      },
    });

    sendSocketData(
      conversation.agentId,
      "conversation:updated",
      updatedConversation
    );

    sendSocketData(conversation.agentId, "conversation-messages:new", [
      newMessage,
      newChatMessage,
    ]);
  }
  return new NextResponse(content, { status: 200 });
}
