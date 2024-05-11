import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import {  currentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { conferenceId, from, to,label,record } = body;
 
  const conference = await client
    .conferences(conferenceId)
    .participants.create({
      label: label,
      beep: "onEnter",
      //  statusCallback: 'https://myapp.com/events',
      //  statusCallbackEvent: ['ringing'],
      startConferenceOnEnter:true,
      endConferenceOnExit:true,
      earlyMedia:true,
      record: record,
      from: from,
      to: to,
    });
  return NextResponse.json(conference, { status: 200 });
}
