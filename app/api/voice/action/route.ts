import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { actionResponse, voicemailResponse } from "@/lib/handler";
import { pusherServer } from "@/lib/pusher";
import { client } from "@/lib/twilio-config";
import { NextResponse } from "next/server";
const callStatus = ["busy", "no-answer", "canceled", "failed"];

export async function POST(req: Request) {  
  return new NextResponse(await voicemailResponse(), { status: 200 });
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