import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import { currentRole } from "@/lib/auth";

export async function POST(req: Request) {
  const role=await currentRole()
  if(!role || role=="USER"){
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { sid, app } = body;

  const results = await client
  .incomingPhoneNumbers(sid)
  .update({
    smsApplicationSid: app,
    voiceApplicationSid: app,
  });

  return NextResponse.json(results, { status: 200 });
}
