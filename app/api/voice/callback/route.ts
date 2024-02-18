import { formatObject } from "@/formulas/objects";
import { db } from "@/lib/db";
import { actionResponse } from "@/lib/handler";
import { pusherServer } from "@/lib/pusher";
import { client } from "@/lib/twilio-config";
import { NextResponse } from "next/server";

//TODO - this is not implemented yet

export async function POST(req: Request) {
  const body = await req.formData();

  const j: any = formatObject(body);

console.log(j)
//   if(callStatus.includes(j.dialCallStatus)){
// return new NextResponse(await actionResponse(), { status: 200 })
//   }
  return new NextResponse("", { status: 200 });
}
