import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { voiceResponse } from "@/lib/twilio/handler";

import { NextResponse } from "next/server";
import { TwilioCall } from "@/types";

export async function POST(req: Request) {
  const body = await req.formData();

  //get all the variable from the body into the twlio cal type
  const call: TwilioCall = formatObject(body);

   //check if this number is a lead or a client
  const lead = await db.lead.findFirst({
    where: { cellPhone: call.callDirection == "outbound" ? call.to : call.from },
  });
 
if(call.callDirection=="outbound"){
  call.agentId = call.caller.replace("client:", "");
  call.direction="outbound"
}else{
  switch (call.direction) {
    //INCOMING CALL
    case "inbound":
      //check information for the agent based on the number called
      const phonenumber = await db.phoneNumber.findFirst({
        where: { phone: call.to },
      });
      //get chat settings based on the agent ID
      const settings = await db.chatSettings.findFirst({
        where: { userId: phonenumber?.agentId! },
      });

      const notificationSettings = await db.notificationSettings.findFirst({
        where: { userId: settings?.userId },
      });

      call.masterSwitch = notificationSettings?.masterSwitch;
      call.personalNumber = notificationSettings?.phoneNumber;

      call.voicemailIn = settings?.voicemailIn;
      call.agentId = phonenumber?.agentId!;
      call.currentCall = settings?.currentCall;

      //if the lead exists set the caller name with lead information
      call.callerName = `${lead?.firstName} ${lead?.lastName}`;
      break;
    //CONFERENCE CALL
    case "conference":
      break;
    //OUTGOING CALL
    default:
      call.agentId = call.caller.replace("client:", "");
      break;
  }
}

  //Set a new record for the call in the database
  if (["inbound","outbound"].includes(call.direction)) {
    await db.call.create({
      data: {
        id: call.callSid,
        userId: call.agentId,
        from: call.from,
        direction: call.direction,
        status: call.callStatus,
        leadId: lead?.id,
      },
    });
  }

  const reponse = await voiceResponse(call);
  return new NextResponse(reponse, { status: 200 });
}
