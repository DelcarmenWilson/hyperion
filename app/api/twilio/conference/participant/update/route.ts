import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";


export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { conferenceId, participantId, label, value } = body;

    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    switch (label) {
      case "hold":
        client
          .conferences(conferenceId)
          .participants(participantId)
          .update({
            hold: value,
            holdUrl:
              "http://twimlets.com/holdmusic?Bucket=com.twilio.music.guitars",
          });
        break;
      case "hangup":
        client.conferences(conferenceId).participants(participantId).remove();
        break;
        case "muted":
        client
          .conferences(conferenceId)
          .participants(participantId)
          .update({
            muted: value,
          });
        break;
    }
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[PARTICIPANT_UPDATE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
