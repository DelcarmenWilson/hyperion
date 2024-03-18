import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import {  hangupReponse, voicemailResponse } from "@/lib/handler";

import { NextResponse } from "next/server";
const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: Request) {
  const body = await req.formData();
  const j: any = formatObject(body);
  
  if (callStatus.includes(j.dialCallStatus)) {
    if(j.direction=="inbound"){
      await db.call.update({where:{id:j.callSid},data:{
        status:j.dialCallStatus
      }})
    }
    
    const phonenumber = await db.phoneNumber.findFirst({
      where: { phone: j.to },
    });
    const settings = await db.chatSettings.findUnique({
      where: { userId: phonenumber?.agentId! },
    });
    j.voicemailIn = settings?.voicemailIn;

    return new NextResponse(await voicemailResponse(j), { status: 200 });
  }
  return new NextResponse(await hangupReponse(), { status: 200 });
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
