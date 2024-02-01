import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();
  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });
 
  const call= await db.call.update({where:{id:j.CallSid},data:{
    recordId:j.RecordingSid,
    recordUrl:j.RecordingUrl,
    recordStatus:j.RecordingStatus,
    recordStartTime:new Date(j.RecordingStartTime),
    recordDuration:parseInt(j.RecordingDuration)
   }})
   
   if (call?.leadId) {
    await pusherServer.trigger(call?.leadId, "calllog:new", call);
    await pusherServer.trigger(call?.agentId, "calllog:new", call);
  }
  return new NextResponse("",{ status: 200 });
}
