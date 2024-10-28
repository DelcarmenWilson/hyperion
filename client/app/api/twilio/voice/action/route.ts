import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { hangupResponse, voicemailResponse } from "@/lib/twilio/handler";

import { NextRequest, NextResponse } from "next/server";
const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: NextRequest) {
  //The paramters passed in from twilio
  const body = await req.formData();
  //Get the voicemailOut url attached as a query string to the current url
  const voicemailIn = req.nextUrl.searchParams.get("voicemailin");
  //Convert the body to Json paramaters
  const j: any = formatObject(body);

  //If the call status matched to any of the defined call statuses update the current call
  //and send a voicemail request back to twilio
  if (callStatus.includes(j.dialCallStatus)) {
    if (j.direction == "inbound") {
      await db.call.update({
        where: { id: j.callSid },
        data: {
          status: j.dialCallStatus,
        },
      });
    }
    //TODO - after the functionaly anove has been tested remove the code below
    // const phonenumber = await db.phoneNumber.findFirst({
    //   where: { phone: j.to },
    // });
    // const settings = await db.phoneSettings.findUnique({
    //   where: { userId: phonenumber?.agentId! },
    // });
    // j.voicemailIn = settings?.voicemailIn;

    return new NextResponse(await voicemailResponse(voicemailIn), {
      status: 200,
    });
  }
  return new NextResponse(await hangupResponse(), { status: 200 });
}

//TODO - this is the old function that works with the gather.. still need to implemetn this one
// export async function POST(req: Request) {
//   const body = await req.formData();

//   const j: any = formatObject(body);
//   if (callStatus.includes(j.dialCallStatus)) {
//     return new NextResponse(await actionResponse(), { status: 200 });
//   }
//   return new NextResponse("", { status: 200 });
// }
