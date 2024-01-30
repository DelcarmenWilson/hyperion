import { db } from "@/lib/db";
import { voiceResponse } from "@/lib/handler";
import { pusherServer } from "@/lib/pusher";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();
  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });

  let lead:any;

  if(j.AgentNumber){
    j.Direction="outbound"
    j.AgentId=j.Caller.replace("client:","")   
     lead = await db.lead.findFirst({where:{cellPhone:j.To}}) 
    j.LeadPhone=j.To
  }
  else{
    lead = await db.lead.findFirst({where:{cellPhone:j.From}}) 
    j.LeadPhone=j.From
    const agent=await db.phoneNumber.findFirst({where:{phone:j.To}})
    j.AgentId=agent?.agentId
  }

  const newCall=await db.call.create({data:{
    id:j.CallSid,
    agentId:j.AgentId,
    from:j.From,
    direction:j.Direction,
    status:j.CallStatus,
    leadId:lead.id
  }})
  await pusherServer.trigger(lead.id,'call:new',newCall)

  const reponse = await voiceResponse(j);
  return new NextResponse(reponse, { status: 200 });
}
