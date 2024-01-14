"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import twilio from "twilio";
import { conversationInsert } from "./conversation";
import { messageInsert } from "./message";

const sid = process.env.TWILIO_CLIENT_ID;
const token = process.env.TWILIO_CLIENT_TOKEN;
const from=process.env.TWILIO_PHONE

export const sendIntialSms = async (leadId: string) => {
    //TODO the entire lead shall be passed
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const lead = await db.lead.findUnique({ where: { id: leadId } });

  if (!lead) {
    return { error: "Lead does not exist" };
  }

  const existingConversation=await db.conversation.findFirst({where:{
    lead:{id:lead.id}
  }})

  if(existingConversation){
    return { error: "Conversation Already exist" };
  }

  const prompt=`Your name is ${user.name}. You are a life insurance agent working with family first life. The main goal is to book an appointment with a lead. You should be very professional and keep your answers short. only answer one question at a time and give the client time to think and respond.Be very persuasive on convinf the lead that he/she needs life insurance. Here is the lead information: ${JSON.stringify(lead)}  `

  const message=`Hey ${lead.firstName} this is ${user.name}  from family first life, how are you today?`

  const conversation= await conversationInsert(user.id,lead.id,message)

  if(!conversation.success){
    return ({error:"Conversation was not created"})
  }

  await messageInsert({role:"prompt",content:prompt},conversation.success)
  await messageInsert({role:"system",content:message},conversation.success)

  const client = twilio(sid, token);
  const result = await client.messages.create({
    body: message,
    from: from,
    to: lead.cellPhone|| lead.homePhone,
  });

  if(!result){
    return { success: "Message was not sent!" };
  }

  return { success: "Inital message sent!" };
};
