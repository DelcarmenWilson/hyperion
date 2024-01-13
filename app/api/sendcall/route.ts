import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const sid = process.env.TWILIO_CLIENT_ID;
const token = process.env.TWILIO_CLIENT_TOKEN;
const from = process.env.TWILIO_PHONE!;

export async function POST(req: Request) {
  try {
    const user = currentUser();
    const body = await req.json();
    const { phone } = body;
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!phone) {
      return new NextResponse("Phone is required", { status: 400 });
    }
    const client = twilio(sid, token);

    client.calls
      .create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: phone,
        from: from,
      })
      .then((call) => {
        let twiml = new VoiceResponse();
        twiml.say("Hello World");   // respond to voice caller
        // callback(null, twiml);
        console.log(call.sid)
      
      });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("[SENDSMD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
