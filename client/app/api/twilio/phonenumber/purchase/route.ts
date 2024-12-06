import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import { currentRole } from "@/lib/auth";
import { createPhoneNumber } from "@/actions/user/phone-number";

export async function POST(req: Request) {
  const role = await currentRole();
  if (!role || role == "USER") {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { phonenumber, state, agentId } = body;
  const app = "AP7be1b9b81ad29a698a869a1b5f7a926a";
  const results = await client.incomingPhoneNumbers.create({
    phoneNumber: phonenumber,
    voiceApplicationSid: app,
    smsApplicationSid: app,
    emergencyAddressSid: "AD0fb0668ae687821d42f4cea08c03062a",
  });
  if (results.sid) {
    const newPhone = await createPhoneNumber(
      {
        phone:phonenumber,
      state,
      agentId,
      sid:results.sid,
      app
      }
    );
   
      return NextResponse.json({ success: "success" }, { status: 200 });

  }

  return NextResponse.json({ error: "error" }, { status: 500 });
}
