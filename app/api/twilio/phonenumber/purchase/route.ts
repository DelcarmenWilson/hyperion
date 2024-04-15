import { NextResponse } from "next/server";
import { client } from "@/lib/twilio-config";
import { currentRole } from "@/lib/auth";
import {  phoneNumberInsertTwilio } from "@/actions/phonenumber";

export async function POST(req: Request) {
  const role=await currentRole()
  if(!role || role=="USER"){
    return NextResponse.json("Un authorized", { status: 401 });
  }
  const body = await req.json();
  const { phonenumber,state, agentId } = body;

  // const results = await client
  //   .incomingPhoneNumbers.create({phoneNumber:phonenumber,voiceApplicationSid:"AP7be1b9b81ad29a698a869a1b5f7a926a",smsApplicationSid:"AP7be1b9b81ad29a698a869a1b5f7a926a",emergencyAddressSid:"AD0fb0668ae687821d42f4cea08c03062a"})
    // if(results.sid){
      const newPhone=await phoneNumberInsertTwilio(phonenumber,state,agentId)
      if(newPhone.success){
        return NextResponse.json({success:"success"}, { status: 200 });
      }
    // }

  return NextResponse.json({error:"error"}, { status: 200 });
}
