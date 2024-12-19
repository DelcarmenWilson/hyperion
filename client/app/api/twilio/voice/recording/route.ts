import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  const recording = (
    await client.recordings.get(j.recordingSid).fetch()
  ).toJSON();

  const call = await db.leadCommunication.update({
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
    sendSocketData(call.userId as string, "calllog:new", "");
  }
  return new NextResponse("", { status: 200 });
}
