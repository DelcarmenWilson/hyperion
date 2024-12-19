import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextRequest, NextResponse } from "next/server";

import { TwilioAmdResult } from "@/types/twilio";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";
import { amdResponse } from "@/lib/twilio/handler";

// const amdStatus = ["machine_start","human","fax","unknown"];
// const amdStatus = [
//   "machine_end_beep",
//   "machine_end_silence",
//   "machine_end_other",
//   "human",
//   "fax",
//   "unknown",
// ];

export async function POST(req: NextRequest) {
  //The paramters passed in from twilio
  const body = await req.formData();

  //Get the voicemailOut url attached as a query string to the current url
  const voicemailOut = req.nextUrl.searchParams.get("voicemailout");

  //Convert the body to Json paramaters
  const amdResult: TwilioAmdResult = formatObject(body);

  //Fetch the exisit call asdicated with the callSid
  const existingCall = await db.leadCommunication.findUnique({
    where: { id: amdResult.callSid },
  });

  //If the call does not exit return an error
  if (!existingCall)
    return new NextResponse("Call does not exists!", { status: 500 });

  const call = await db.leadCommunication.update({
    where: { id: amdResult.callSid },
    data: {
      answeredBy: amdResult.answeredBy,
      machineDetectionDuration: amdResult.machineDetectionDuration,
    },
  });
  if (!call)
    return new NextResponse("Call could not be updated", { status: 500 });

  //TODO - we can possibly ping the agent to send the voicemail and end the call
  //   if (call?.leadId) sendSocketData(call.userId, "calllog:new", call);

    
  const response = await amdResponse(amdResult.answeredBy,voicemailOut);

  return new NextResponse(response, { status: 200 });
  //return an Success message if everything is ok
//   return new NextResponse(reponse, { status: 200 });
}
