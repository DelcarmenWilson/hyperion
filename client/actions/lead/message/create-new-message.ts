"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { MessageType } from "@/types/message";
import {
  SmsMessageSchema,
  SmsMessageSchemaType,
} from "@/schemas/message";

import { createConversation } from "../conversation/create-conversation";
import { insertMessage } from "./insert-message";
import { smsSend } from "../../sms";

import { userGetByAssistantOld } from "@/data/user";


export const createNewMessage = async (values: SmsMessageSchemaType) => {
  const user = await currentUser();
  if (!user)  throw new Error("Unauthenticated!");

  const {success,data} = SmsMessageSchema.safeParse(values);
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
    content:data.content,
    conversationId: convoid!,
    type:MessageType.AGENT,
    attachment: data.images,
    senderId: user.id,
    hasSeen: true,
  });

  if (!result) 
    throw new Error("Message was not sent!");

  return  newMessage ;
};


