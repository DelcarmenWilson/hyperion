import { db } from "@/lib/db";
import axios from "axios";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { MessageSchemaType } from "@/schemas/message";
import { messageInsert } from "@/actions/message";
import { chatFetch } from "@/actions/gpt";

import { appointmentInsert } from "@/actions/appointment";
import { formatObject } from "@/formulas/objects";
import {
  disabledAutoChatResponse,
  getKeywordResponse,
  smsSend,
  forwardTextToLead,
} from "@/actions/sms";
import { TwilioSms } from "@/types";
import { formatDateTime } from "@/formulas/dates";

export async function POST(req: Request) {
  const body = await req.formData();

  const sms: TwilioSms = formatObject(body);

  //Find the agent number where this message is going to
  const agentNumber = await db.phoneNumber.findFirst({
    where: { phone: sms.to },
  });

  //If agent is not found return null
  if (!agentNumber) {
    return new NextResponse(null, { status: 500 });
  }

  //Find the agent with this personal number - from number
  const agent = await db.notificationSettings.findFirst({
    where: { phoneNumber: sms.from },
  });
  //TODO - dpnt forget to uncomment when completed
  // if from number and to number both belong to the agent
  // if (agent && agentNumber.agentId == agent.userId) {
  //   //Start Agent to Lead Message Process
  //   await forwardTextToLead(sms, agent.userId);
  //   return new NextResponse("message from agent to lead", { status: 200 });
  // }

  //Pulling the entire conversation based on the phone number
  const conversation = await db.conversation.findFirst({
    where: {
      lead: {
        cellPhone: sms.from,
      },
      agentId: agentNumber.agentId!,
    },
    include: { lead: true },
  });

  //If the conversation does not exist - exit the work flow
  if (!conversation) {
    //TODO - create a new lead into a temp lead table
    return new NextResponse(null, { status: 200 });
  }

  //The incoming message from the lead
  const smsFromLead: MessageSchemaType = {
    role: "user",
    content: sms.body,
    conversationId: conversation.id,
    senderId: conversation.leadId,
    hasSeen: false,
    sid: sms.smsSid,
  };
  //Create a new message from the leads response
  const newMessage = (await messageInsert(smsFromLead)).success;

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

   //If autochat is disabled
   if (!conversation.autoChat) {
    await disabledAutoChatResponse(conversation, newMessage);
    //exit the workflow
    return new NextResponse("Titan is off!", { status: 200 });
  }

  //If autochat is enabled - get all the messages in the conversation
  const messages = await db.message.findMany({
    where: { conversationId: conversation.id },
  });

   //Convert all the messags into a list that chatGpt can read
   let chatMessages = messages.map((message) => {
    return { role: message.role, content: message.content };
  });

   //Add the current message from the lead
   chatMessages.push({ ...smsFromLead });

   //Send the conversation to chatGpt and return a response
  const chatResponse = await chatFetch(chatMessages);
  const { role, content } = chatResponse.choices[0].message;

  //If there is no response from chatGpt - exit the workflow
  if (!content) {
    return new NextResponse("Thank you for your message", { status: 200 });
  }


  //Wait 5 seconds before inserting the new message from chatGpt
  // const delay = Math.round(content.length / 35) * 8;
  const words = content.split;
  const wpm = 38;
  const delay = Math.round(words.length / wpm);
  const sid = (await smsSend(sms.to, sms.from, content)).success;

  //Insert the new message from chat gpt into the conversation
  const newChatMessage = (
    await messageInsert({
      role,
      content,
      conversationId: conversation.id,
      senderId: conversation.agentId,
      hasSeen: false,
      sid,
    })
  ).success; 

  await axios.post("http://localhost:4000/message", {
    userId: agentNumber.agentId,
  });

  return new NextResponse("ok", { status: 200 });
}