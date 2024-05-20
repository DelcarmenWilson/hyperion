import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import {  currentUser } from "@/lib/auth";
import { TwilioShortParticipant } from "@/types/twilio";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const participant: TwilioShortParticipant = await req.json();
  const conference = await client
    .conferences(participant.conferenceSid)
    .participants.create({
      label: participant.label as string,
      beep: "onEnter",
      //  statusCallback: 'https://myapp.com/events',
      //  statusCallbackEvent: ['ringing'],
      startConferenceOnEnter:participant.startConferenceOnEnter,
      endConferenceOnExit:participant.endConferenceOnExit,
      earlyMedia:participant.earlyMedia,
      record: participant.record,
      from: participant.from,
      to: participant.to,
      coaching:participant.coaching,
      callSidToCoach:participant.callSidToCoach as string

    });
  return NextResponse.json(conference, { status: 200 });
}


// export async function POST(req: Request) {
//   const user = await currentUser();
//   if (!user) {
//     return NextResponse.json("Unauthorized", { status: 401 });
//   }
//   const body = await req.json();
//   const { conferenceId, from, to,label,earlyMedia,endConferenceOnExit,record,coaching,callSidToCoach} = body;
 
//   const conference = await client
//     .conferences(conferenceId)
//     .participants.create({
//       label: label,
//       beep: "onEnter",
//       //  statusCallback: 'https://myapp.com/events',
//       //  statusCallbackEvent: ['ringing'],
//       startConferenceOnEnter:true,
//       endConferenceOnExit:endConferenceOnExit,
//       earlyMedia:earlyMedia,
//       record: record,
//       from: from,
//       to: to,
//       coaching:coaching,
//       callSidToCoach

//     });
//   return NextResponse.json(conference, { status: 200 });
// }