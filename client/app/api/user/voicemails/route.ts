import { NextResponse } from "next/server";
import { voicemailGetUnHeard } from "@/actions/voicemail";

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
