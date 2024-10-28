import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { TwilioCallResult } from "@/types";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";

const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: Request) {
  //The paramters passed in from twilio
  const body = await req.formData();

    //Convert the body to Json paramaters
  const callResult: TwilioCallResult = formatObject(body);

  //Fetch the exisit call asdicated with the callSid
  const existingCall = await db.call.findUnique({
    where: { id: callResult.callSid },
  });

  //If the call does not exit return an error
  if (!existingCall) 
    return new NextResponse("Call does not exists!", { status: 500 });
  
  // Fecth more information about this call from twilio
  // this is mainly for the price
  //TODO - see if/how we can get rid of this extra functionality
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
//if this call has a lead associated with it send  call information to the  agent asssigned to this lead
  if (call?.leadId) 
    sendSocketData(call.userId, "calllog:new", call);  

//return an Success message if everything is ok
  return new NextResponse("Success", { status: 200 });
}
