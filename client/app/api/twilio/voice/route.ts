import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { TwilioCall } from "@/types";

import { voiceResponse } from "@/lib/twilio/handler";
import { formatObject } from "@/formulas/objects";

import { getOrCreateLeadByPhoneNumber } from "@/actions/lead";
import { updateBluePrintWeekData } from "@/actions/blueprint/week";
import { createCall } from "@/actions/call";

export async function POST(req: Request) {
  const body = await req.formData();

  //get all the variable from the body into the twlio cal type
  const call: TwilioCall = formatObject(body);
  let agentId = call.caller.replace("client:", "");
  //check information for the agent based on the number called
  const agentPhoneNumber = await db.phoneNumber.findFirst({
    where: { phone: call.to },
  });

  //if there is an associated agent phonenumber change the agent id to the agent id from the database
  if (agentPhoneNumber) agentId = agentPhoneNumber.agentId!;

  const direction=call.callDirection||"inbound"

  //get the lead information based on the phone number and call direction
  const lead = await getOrCreateLeadByPhoneNumber({
    cellPhone: direction == "outbound" ? call.to : call.from,
    state: call.callerState,
    agentId,
  });

  if (direction == "outbound") {
    call.agentId = agentId;
    call.direction = "outbound";

    updateBluePrintWeekData(agentId, "calls");
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
        call.agentId = agentId;
        break;
    }
  }

  //Set a new record for the call in the database
  if (["inbound", "outbound"].includes(call.direction)) {
    await createCall({   
        id: call.callSid,
        agentId: call.agentId,
        from: call.from,
        direction: call.direction,
        status: call.callStatus,
        leadId: lead?.id,
    });
  }

  const reponse = await voiceResponse(call);
  return new NextResponse(reponse, { status: 200 });
}
