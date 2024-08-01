import { db } from "@/lib/db";
import axios from "axios";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { formatObject } from "@/formulas/objects";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  const recording = (await client.recordings.get(j.recordingSid).fetch()).toJSON();

  const call = await db.call.update({
    where: { id: j.callSid },
    data: {
      recordId: j.recordingSid,
      recordUrl: j.recordingUrl,
      recordStatus: j.recordingStatus,
      recordStartTime: new Date(j.recordingStartTime),
      recordDuration: parseInt(j.recordingDuration),
      recordPrice: recording.price,    
    },
  });

  if (call?.leadId) {
    axios.post("http://localhost:4000/socket", {
      userId: call.userId,
      type: "calllog:new",
    });
  }
  return new NextResponse("", { status: 200 });
}
