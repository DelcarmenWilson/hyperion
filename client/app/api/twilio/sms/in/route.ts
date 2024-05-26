import * as z from "zod";
import { db } from "@/lib/db";
import { userEmitter } from "@/lib/event-emmiter";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { MessageSchema } from "@/schemas";
import { messageInsert } from "@/actions/message";
import { chatFetch } from "@/actions/gpt";

import { defaultOptOut } from "@/placeholder/chat";
import { format } from "date-fns";
import { appointmentInsert } from "@/actions/appointment";
import { formatObject } from "@/formulas/objects";
import { smsSend } from "@/actions/sms";
import { TwilioSms } from "@/types/twilio";

export async function POST(req: Request) {
  const body = await req.formData();

  const sms: TwilioSms = formatObject(body);
let updatedConversation
  //Pulling the entire conversation based on the phone number
  const conversation = await db.conversation.findFirst({
    where: {
      lead: {
        cellPhone: sms.from,
      },
    },
  });

  //If the conversation does not exist - exit the work flow
  if (!conversation) {
    //TODO - create a new lead into a temp lead table
    return new NextResponse(null, { status: 200 });
  }

  //The incoming message from the lead
  const smsFromLead: z.infer<typeof MessageSchema> = {
    role: "user",
    content: sms.body,
    conversationId: conversation?.id!,
    senderId: conversation?.agentId!,
    hasSeen: false,
  };

  //Create a new message from the leads response
  const newMessage = (await messageInsert(smsFromLead)).success;

  switch (smsFromLead.content.toLowerCase()) {
    case "stop":
    case "cancel":
      await db.lead.update({
        where: { id: conversation.leadId },
        data: { status: "Do_Not_Call" },
      });
      await smsSend(sms.to, sms.from, defaultOptOut.confirm);
      return new NextResponse(defaultOptOut.confirm, { status: 200 });
    case "reset":
      await db.conversation.delete({ where: { id: conversation.id } });
      await smsSend(sms.to, sms.from, "Conversation has been reset");
      return new NextResponse("Conversation has been reset", { status: 200 });
  }

  //If autochat is disabled - exit the workflow
  if (!conversation.autoChat) {
    updatedConversation=await db.conversation.update({where:{id:conversation.id},data:{
      lastMessage:newMessage?.content
    }})
    
    await pusherServer.trigger(conversation.agentId, "conversation:updated", updatedConversation);
    await pusherServer.trigger(conversation.id, "message:new", newMessage);
    await pusherServer.trigger(conversation.agentId, "message:notify", null);
    return new NextResponse(null, { status: 200 });
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

  //Send the conversation from chatGpt and return a response
  const chatResponse = await chatFetch(chatMessages);
  const { role, content } = chatResponse.choices[0].message;

  //If there is no response from chatGpt - exit the workflow
  if (!content) {
    return new NextResponse("Thank you for your message", { status: 200 });
  }

  //Insert the new message from chat gpt into the conversation
  const newChatMessage= (await messageInsert({
    role,
    content,
    conversationId: conversation.id,
    senderId: conversation.agentId,
    hasSeen: false,
  })).success;

  //If the message from chatGpt includes the key word {schedule} - lets schedule an appointment
  if (content.includes("{schedule}")) {
    const aptDate = new Date(content.replace("{schedule}", "").trim());
    await appointmentInsert(
      {
        startDate: aptDate,
        leadId: conversation.leadId,
        agentId: conversation.agentId,
        label: "blue",
        comments: "",
      },
      false
    );

    const appointmentMessage = `Appointment has been schedule for ${format(
      aptDate,
      "MM-dd @ hh:mm aa"
    )}`;
    await smsSend(sms.to, sms.from, appointmentMessage);
    return new NextResponse(
      `Appointment has been schedule for ${format(
        aptDate,
        "MM-dd @ hh:mm aa"
      )}`,
      { status: 200 }
    );
  }
  //Wait 5 seconds before inserting the new message from chatGpt
  // const delay = Math.round(content.length / 35) * 8;

  const words = content.split;
  const wpm = 38;
  const delay = Math.round(words.length / wpm);
  await smsSend(sms.to, sms.from, content, delay);
  if (newChatMessage) {
    updatedConversation=await db.conversation.update({where:{id:conversation.id},data:{
      lastMessage:newChatMessage?.content
    }})
    
    await pusherServer.trigger(conversation.agentId, "conversation:updated", updatedConversation);
     await pusherServer.trigger(conversation.id, "messages:new", [newMessage,newChatMessage]);
    await pusherServer.trigger(conversation.agentId, "message:notify", null);
  }
  return new NextResponse(content, { status: 200 });
}

export async function PUT(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  //Pulling the entire conversation based on the phone number
  const conversation = await db.conversation.findFirst({
    where: {
      lead: {
        cellPhone: j.from,
      },
    },
  });
  //The incoming message from the lead
  const textFromLead: z.infer<typeof MessageSchema> = {
    role: "user",
    content: j.body,
    conversationId: conversation?.id!,
    senderId: conversation?.agentId!,
    hasSeen: false,
  };

  if (!conversation) {
    return new NextResponse(null, { status: 500 });
  }

  const newMessage = await messageInsert(textFromLead);

  if (newMessage.success) {
    userEmitter.emit("messageInserted", newMessage.success);
  }

  switch (textFromLead.content.toLowerCase()) {
    case "stop":
      await db.lead.update({
        where: { id: conversation.leadId },
        data: { status: "Do_Not_Call" },
      });
      return new NextResponse(defaultOptOut.confirm, { status: 200 });
    case "reset":
      await db.conversation.delete({ where: { id: conversation.id } });
      return new NextResponse("Conversation has been reset", { status: 200 });
  }

  if (!conversation.autoChat) {
    return new NextResponse(null, { status: 200 });
  }
  //If auto chat is enable continue to respond to the lead
  const messages = await db.message.findMany({
    where: { conversationId: conversation.id },
  });

  let chatmessages = messages.map((message) => {
    return { role: message.role, content: message.content };
  });
  chatmessages.push({ role: textFromLead.role, content: textFromLead.content });

  const chatresponse = await chatFetch(chatmessages);
  const { role, content } = chatresponse.choices[0].message;

  if (!content) {
    return new NextResponse("Thank you for your message", { status: 200 });
  }

  setTimeout(async () => {
    const chatReponse = await messageInsert({
      role,
      content,
      conversationId: conversation.id,
      senderId: conversation.agentId,
      hasSeen: false,
    });
    if (chatReponse.success) {
      userEmitter.emit("messageInserted", chatReponse.success);
    }
  }, 5000);

  if (content.includes("{schedule}")) {
    const aptDate = new Date(content.replace("{schedule}", "").trim());
    await appointmentInsert(
      {
        startDate: aptDate,
        leadId: conversation.leadId,
        agentId: conversation.agentId,
        label: "blue",
        comments: "",
      },
      false
    );

    return new NextResponse(
      `Appointment has been schedule for ${format(
        aptDate,
        "MM-dd @ hh:mm aa"
      )}`,
      { status: 200 }
    );
  }
  console.log("we made it here");

  return new NextResponse(content, { status: 200 });
}
