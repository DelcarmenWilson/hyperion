import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { TwilioCall } from "@/types";

import { voiceResponse } from "@/lib/twilio/handler";
import { formatObject } from "@/formulas/objects";

import { bluePrintWeekUpdateByUserIdData } from "@/actions/blueprint/week/get-blueprint-weeks";
import { leadGetOrCreateByPhoneNumber } from "@/actions/lead";


export async function POST(req: Request) {
  const body = await req.formData();

  //get all the variable from the body into the twlio cal type
  const call: TwilioCall = formatObject(body);

  //check information for the agent based on the number called
  const agentPhoneNumber = await db.phoneNumber.findFirst({
    where: { phone: call.callDirection == "outbound" ? call.from : call.to },
  });

  //get the lead information based on the phone number and call direction
  const lead = await leadGetOrCreateByPhoneNumber(
    call.callDirection == "outbound" ? call.to : call.from,
    call.callerState,
    agentPhoneNumber?.agentId as string
  );

  if (call.callDirection == "outbound") {
    call.agentId = call.caller.replace("client:", "");
    call.direction = "outbound";

    if (agentPhoneNumber) {
      bluePrintWeekUpdateByUserIdData(
        agentPhoneNumber.agentId as string,
        "calls"
      );
    }
  } else {
    switch (call.direction) {
      //INCOMING CALL
      case "inbound":
        //check information for the agent based on the number called
        const phonenumber = await db.phoneNumber.findFirst({
          where: { phone: call.to },
        });
        //get chat settings based on the agent ID
        const settings = await db.phoneSettings.findFirst({
          where: { userId: phonenumber?.agentId! },
        });

        const notificationSettings = await db.notificationSettings.findFirst({
          where: { userId: settings?.userId },
        });

        call.masterSwitch = notificationSettings?.masterSwitch;
        call.personalNumber = settings?.personalNumber!;
        call.voicemailIn = settings?.voicemailIn;
        call.voicemailOut = settings?.voicemailOut;
        call.agentId = phonenumber?.agentId!;
        call.currentCall = settings?.currentCall;

        //if the lead exists set the caller name with lead information
        call.callerName = `${lead?.firstName!} ${lead?.lastName!}`;
        break;
      //CONFERENCE CALL
      case "conference":
        break;
      //OUTGOING CALL
      default:
        call.agentId = call.caller.replace("client:", "");
        break;
    }
  }

  //Set a new record for the call in the database
  if (["inbound", "outbound"].includes(call.direction)) {
    await db.call.create({
      data: {
        id: call.callSid,
        userId: call.agentId,
        from: call.from,
        direction: call.direction,
        status: call.callStatus,
        leadId: lead?.id,
      },
    });
  }

  const reponse = await voiceResponse(call);
  return new NextResponse(reponse, { status: 200 });
}


