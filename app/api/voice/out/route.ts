import { currentUser } from "@/lib/auth";
import { voiceResponse } from "@/lib/twilio-handler";
import { NextResponse } from "next/server";
// import twilio from "twilio";


// import { cfg } from "@/lib/twilio-config";
// const client = twilio(cfg.accountSid,cfg.apiToken);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { phone, message } = body;
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // const voiceResponse=twilio.twiml.VoiceResponse 
    // let twiml=new voiceResponse()
    // let dial=twiml.dial('+13478030962')
     

    // const call =await client.calls
    //   .create({
    //      twiml:dial ,
    //      to: '+13478030962',
    //      from: cfg.callerId
    //    });
       
    return new NextResponse(voiceResponse("+13478030962"));
  } catch (error) {
    console.log("[VOICE_OUT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
