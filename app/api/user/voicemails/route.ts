import { appointmentsGetAllByUserIdUpcoming } from "@/data/appointment";
import { voicemailGetUnHeard } from "@/data/voicemail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;
    const voicemails = await voicemailGetUnHeard(user);

    return NextResponse.json(voicemails);
  } catch (error) {
    console.log("[VOICEMAIL_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
