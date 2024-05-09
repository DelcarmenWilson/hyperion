import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";

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
    await pusherServer.trigger(call?.leadId, "calllog:new", call);
    await pusherServer.trigger(call?.userId, "calllog:new", call);
  }
  return new NextResponse("", { status: 200 });
}
