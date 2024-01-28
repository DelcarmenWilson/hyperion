import { voiceResponse } from "@/lib/handler";
import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  const body = await req.formData();
  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });
 
  console.log(j)
  return new NextResponse("",{ status: 200 });
}
