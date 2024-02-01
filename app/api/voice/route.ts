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

  const lead = await db.lead.findFirst({
    where: { cellPhone: j.Direction == "outbound" ? j.To : j.From },
  });

  if (j.Direction == "outbound") {
    j.AgentId = j.Caller.replace("client:", "");
  } else {
    const phonenumber = await db.phoneNumber.findFirst({
      where: { phone: j.To },
    });
    const settings = await db.chatSettings.findUnique({
      where: { userId: phonenumber?.agentId! },
    });
    j.Recording = settings?.record
      ? "record-from-answer-dual"
      : "do-not-record";
    j.AgentId = phonenumber?.agentId;
  }

  await db.chatSettings.update({
    where: { userId: j.AgentId },
    data: {
      currentCall: j.CallSid,
    },
  });

  const newCall = await db.call.create({
    data: {
      id: j.CallSid,
      agentId: j.AgentId,
      from: j.From,
      direction: j.Direction,
      status: j.CallStatus,
      leadId: lead?.id,
    },
  });

  if (j.Coach == "on") {
    const agent = await db.user.findUnique({
      where: { id: j.AgentId },
      include: {
        phoneNumbers: {
          where: { status: "default" },
        },
        chatSettings: true,
      },
    });
    await pusherServer.trigger(j.AgentId, "call:coach", agent);
  }
  if (lead?.id) {
    await pusherServer.trigger(lead?.id, "call:new", newCall);
  }

  const reponse = await voiceResponse(j);
  return new NextResponse(reponse, { status: 200 });
}
