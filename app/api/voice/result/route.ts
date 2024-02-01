import { db } from "@/lib/db";
import { voiceResponse } from "@/lib/handler";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  const body = await req.formData();
  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });
  
 const call=await db.call.update({where:{id:j.CallSid},data:{
  status:j.CallStatus,
  duration:parseInt(j.CallDuration)
 }})

 if (call?.leadId) {
  await pusherServer.trigger(call?.leadId, "calllog:new", call);
  await pusherServer.trigger(call?.agentId, "calllog:new", call);
}
  
  return new NextResponse("",{ status: 200 });
}
