import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { TwilioConferenceRecording } from "@/types";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";

export async function POST(req: Request) {
  const body = await req.formData();

  const call: TwilioConferenceRecording = formatObject(body);

  const recording = (
    await client.recordings.get(call.recordingSid).fetch()
  ).toJSON();

  const newCall = await db.leadCommunication.update({
    where: { id: recording.callSid },
    data: {
      recordId: call.recordingSid,
      recordUrl: call.recordingUrl,
      recordStatus: call.recordingStatus,
      recordStartTime: new Date(call.recordingStartTime),
      recordDuration: parseInt(call.recordingDuration),
      recordPrice: recording.price,
      type: "conference",
    },
    include: { conversation: { select: { leadId: true, agentId: true } } },
  });

  if (newCall?.conversation.leadId)
    sendSocketData(newCall.conversation.agentId, "calllog:new", "");

  return new NextResponse("", { status: 200 });
}
