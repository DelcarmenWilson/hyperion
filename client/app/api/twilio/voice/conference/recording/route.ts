import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { client } from "@/lib/twilio/config";
import { TwilioConferenceRecording } from "@/types/twilio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();

  const call: TwilioConferenceRecording = formatObject(body);

  const recording = (await client.recordings.get(call.recordingSid).fetch()).toJSON();

  const newCall = await db.call.update({
    where: { id: recording.callSid },
    data: {
      recordId: call.recordingSid,
      recordUrl: call.recordingUrl,
      recordStatus: call.recordingStatus,
      recordStartTime: new Date(call.recordingStartTime),
      recordDuration: parseInt(call.recordingDuration),
      recordPrice: recording.price,    
      type:"conference"
    },
  });

  if (newCall?.leadId) {
    await pusherServer.trigger(newCall?.leadId, "calllog:new", newCall);
    await pusherServer.trigger(newCall?.userId, "calllog:new", newCall);
  }
  return new NextResponse("", { status: 200 });
}
