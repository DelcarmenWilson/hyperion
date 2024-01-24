import { voiceResponse } from "@/lib/handler";
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request,res:any) {
  const body = await req.formData();
  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });
  // const twiml = new twilio.twiml.VoiceResponse();
  // twiml.say("Hello how are you doing");
  console.log(res)
  // res.send(voiceResponse(j))
   return   new NextResponse(voiceResponse(j),{status:200});
}
