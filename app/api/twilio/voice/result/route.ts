import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  const results = (await client.calls.get(j.callSid).fetch()).toJSON();
  const existingCall = await db.call.findUnique({ where: { id: j.callSid } });
  if (!existingCall) {
    console.log("CALL_RESULT_POST_ERROR");
    return new NextResponse("Error", { status: 200 });
  }
  const call = await db.call.update({
    where: { id: j.callSid },
    data: {
      status: callStatus.includes(existingCall.status as string)
        ? existingCall.status
        : j.callStatus,
      duration: parseInt(j.callDuration),
      price: results.price,
    },
  });

  await db.chatSettings.update({
    where: { userId: call.userId },
    data: {
      currentCall: null,
    },
  });

  if (call?.leadId) {
    // await pusherServer.trigger(call?.leadId, "calllog:new", call);
    // await pusherServer.trigger(call?.userId, "calllog:new", call);
  }

  return new NextResponse("", { status: 200 });
}
