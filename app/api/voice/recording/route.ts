import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();
  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });
 
  await db.call.update({where:{id:j.CallSid},data:{
    recordId:j.RecordingSid,
    recordUrl:j.RecordingUrl,
    recordStatus:j.RecordingStatus,
    recordStartTime:new Date(j.RecordingStartTime),
    recordDuration:j.RecordingDuration
   }})
   
  return new NextResponse("",{ status: 200 });
}
