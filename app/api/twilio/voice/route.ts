import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { voiceResponse } from "@/lib/twilio/handler";
import { pusherServer } from "@/lib/pusher";
import socket from "@/lib/socket";

import { NextResponse } from "next/server";
import { TwilioCall } from "@/types/twilio";

export async function POST(req: Request) {
  const body = await req.formData();

  const call: TwilioCall = formatObject(body);

  const lead = await db.lead.findFirst({
    where: { cellPhone: call.direction == "outbound" ? call.to : call.from },
  });

  if (call.direction == "outbound") {
    call.agentId = call.caller.replace("client:", "");
  } else if (call.direction == "inbound"){
    const phonenumber = await db.phoneNumber.findFirst({
      where: { phone: call.to },
    });
    const settings = await db.chatSettings.findUnique({
      where: { userId: phonenumber?.agentId! },
    });
    call.recording = settings?.record!
      call.voicemailIn=settings?.voicemailIn
    call.agentId = phonenumber?.agentId!;
  }

  await db.chatSettings.update({
    where: { userId: call.agentId },
    data: {
      currentCall: call.callSid,
    },
  });

  const newCall = await db.call.create({
    data: {
      id: call.callSid,
      userId: call.agentId,
      from: call.from,
      direction: call.direction,
      status: call.callStatus,
      leadId: lead?.id,
    },
  });

  if (call.coach == "on") {
    const agent = await db.user.findUnique({
      where: { id: call.agentId },
      include: {
        phoneNumbers: {
          where: { status: "default" },
        },
        chatSettings: true,
      },
    });
    await pusherServer.trigger(call.agentId, "call:coach", agent);
  }
  call.callerName=`${lead?.firstName} ${lead?.lastName}`
  if (lead?.id) {
    console.log("new call should emit")    
    socket.emit('new-call',newCall)
    //  await pusherServer.trigger(lead?.id, "call:new", newCall);
  }

  const reponse = await voiceResponse(call);
  return new NextResponse(reponse, { status: 200 });
}
