import { db } from "@/lib/db";
import { client } from "@/lib/twilio/config";
import { NextResponse } from "next/server";
import { TwilioCallResult } from "@/types";
import { formatObject } from "@/formulas/objects";
import { sendSocketData } from "@/services/socket-service";
import { updatAppointmentStatusFromCall } from "@/actions/appointment";

const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: Request) {
  //The paramters passed in from twilio
  const body = await req.formData();

  //Convert the body to Json paramaters
  const callResult: TwilioCallResult = formatObject(body);

  //Fetch the exisit call asdicated with the callSid
  const existingCall = await db.leadCommunication.findUnique({
    where: { id: callResult.callSid },
  });

  //If the call does not exit return an error
  if (!existingCall)
    return new NextResponse("Call does not exists!", { status: 500 });

  // Fecth more information about this call from twilio
  // this is mainly for the price
  //TODO - see if/how we can get rid of this extra functionality
  const { price } = (
    await client.calls.get(callResult.callSid).fetch()
  ).toJSON();
  const duration = parseInt(callResult.callDuration);

  const call = await db.leadCommunication.update({
    where: { id: callResult.callSid },
    data: {
      status: callStatus.includes(existingCall.status as string)
        ? existingCall.status
        : callResult.callStatus,
      duration,
      price,
    },
    include:{conversation:{select:{leadId:true,agentId:true}}}
  });
  //if this call has a lead associated with it send  call information to the  agent asssigned to this lead
  if (call.conversation.leadId) {
    await updatAppointmentStatusFromCall({
      callId: call.id,
      leadId: call.conversation.leadId,
      agentId: call.conversation.agentId,
      duration,
      direction: call.direction,
      setAppointment:!!call.appointmentId
    });
    sendSocketData(call.conversation.agentId, "calllog:new", call);
  }

  //return an Success message if everything is ok
  return new NextResponse("Success", { status: 200 });
}
