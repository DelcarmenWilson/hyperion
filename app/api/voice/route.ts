import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { voiceResponse } from "@/lib/handler";
import { pusherServer } from "@/lib/pusher";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  const lead = await db.lead.findFirst({
    where: { cellPhone: j.direction == "outbound" ? j.to : j.from },
  });

  if (j.direction == "outbound") {
    j.agentId = j.caller.replace("client:", "");
  } else {
    const phonenumber = await db.phoneNumber.findFirst({
      where: { phone: j.to },
    });
    const settings = await db.chatSettings.findUnique({
      where: { userId: phonenumber?.agentId! },
    });
    j.recording = settings?.record
      ? "record-from-answer-dual"
      : "do-not-record";
      j.voicemailIn=settings?.voicemailIn
    j.agentId = phonenumber?.agentId;
  }

  await db.chatSettings.update({
    where: { userId: j.agentId },
    data: {
      currentCall: j.callSid,
    },
  });

  const newCall = await db.call.create({
    data: {
      id: j.callSid,
      userId: j.agentId,
      from: j.from,
      direction: j.direction,
      status: j.callStatus,
      leadId: lead?.id,
    },
  });

  if (j.Coach == "on") {
    const agent = await db.user.findUnique({
      where: { id: j.agentId },
      include: {
        phoneNumbers: {
          where: { status: "default" },
        },
        chatSettings: true,
      },
    });
    await pusherServer.trigger(j.agentId, "call:coach", agent);
  }
  if (lead?.id) {
    await pusherServer.trigger(lead?.id, "call:new", newCall);
  }

  const reponse = await voiceResponse(j);
  return new NextResponse(reponse, { status: 200 });
}
