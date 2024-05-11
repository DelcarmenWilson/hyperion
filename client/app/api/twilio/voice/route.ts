import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { voiceResponse } from "@/lib/twilio/handler";

import { NextResponse } from "next/server";
import { TwilioCall } from "@/types/twilio";

export async function POST(req: Request) {
  const body = await req.formData();

  const call: TwilioCall = formatObject(body);

  const lead = await db.lead.findFirst({
    where: { cellPhone: call.direction == "outbound" ? call.to : call.from },
  });

  switch (call.direction) {
    case "inbound":
      const phonenumber = await db.phoneNumber.findFirst({
        where: { phone: call.to },
      });
      const settings = await db.chatSettings.findUnique({
        where: { userId: phonenumber?.agentId! },
      });
      call.recording = settings?.record!;
      call.voicemailIn = settings?.voicemailIn;
      call.agentId = phonenumber?.agentId!;
      call.currentCall = settings?.currentCall;
      break;
    case "conference":
      break;
    default:
      call.agentId = call.caller.replace("client:", "");
      break;
  }
  // if (call.direction == "outbound") {
  //   call.agentId = call.caller.replace("client:", "");
  //   await db.chatSettings.update({
  //     where: { userId: call.agentId },
  //     data: { currentCall: call.callSid },
  //   });
  // } else if (call.direction == "inbound") {
  // }

  if (call.direction == "inbound" || call.direction == "outbound"){
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
  call.callerName = `${lead?.firstName} ${lead?.lastName}`;

  const reponse = await voiceResponse(call);
  return new NextResponse(reponse, { status: 200 });
}
