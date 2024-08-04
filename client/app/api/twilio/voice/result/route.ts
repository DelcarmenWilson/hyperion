import { db } from "@/lib/db";
import axios from "axios";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { TwilioCallResult } from "@/types";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";

const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: Request) {
  const body = await req.formData();

  const callResult: TwilioCallResult = formatObject(body);

  const existingCall = await db.call.findUnique({
    where: { id: callResult.callSid },
  });
  if (!existingCall) {
    console.log("CALL_RESULT_POST_ERROR");
    return new NextResponse("Error", { status: 500 });
  }
  const results = (await client.calls.get(callResult.callSid).fetch()).toJSON();

  const call = await db.call.update({
    where: { id: callResult.callSid },
    data: {
      status: callStatus.includes(existingCall.status as string)
        ? existingCall.status
        : callResult.callStatus,
      duration: parseInt(callResult.callDuration),
      price: results.price,
    },
  });

  if (call?.leadId) {
    sendSocketData(call.userId, "calllog:new", call);
  }

  return new NextResponse("", { status: 200 });
}
