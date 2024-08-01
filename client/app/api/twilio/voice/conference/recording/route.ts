import { db } from "@/lib/db";
import axios from "axios";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { TwilioConferenceRecording } from "@/types";
import { formatObject } from "@/formulas/objects";

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
    axios.post("http://localhost:4000/socket", {
      userId: newCall.userId,
      type: "calllog:new",
    });
  }
  return new NextResponse("", { status: 200 });
}
