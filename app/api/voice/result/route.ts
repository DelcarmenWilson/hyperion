import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { client } from "@/lib/twilio-config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

  const results = (await client.calls.get(j.callSid).fetch()).toJSON();

  const call = await db.call.update({
    where: { id: j.callSid },
    data: {
      status: j.callStatus,
      duration: parseInt(j.callDuration),
      price: results.price,
    },
  });

  if (call?.leadId) {
    await pusherServer.trigger(call?.leadId, "calllog:new", call);
    await pusherServer.trigger(call?.userId, "calllog:new", call);
  }

  return new NextResponse("", { status: 200 });
}
