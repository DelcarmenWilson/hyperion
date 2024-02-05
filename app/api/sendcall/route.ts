import { currentUser } from "@/lib/auth";
import { client } from "@/lib/twilio-config";
import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

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
