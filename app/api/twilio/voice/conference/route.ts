import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import { currentRole } from "@/lib/auth";

export async function POST(req: Request) {
  const role = await currentRole();
  if (!role || role == "USER") {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { conferenceId, from, to,label,record } = body;

  const conference = await client
    .conferences(conferenceId)
    .participants.create({
      label: label,
      earlyMedia: true,
      beep: "onEnter",
      //  statusCallback: 'https://myapp.com/events',
      //  statusCallbackEvent: ['ringing'],
      record: record,
      from: from,
      to: to,
    });

  return NextResponse.json(conference, { status: 200 });
}
