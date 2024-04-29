import { NextRequest, NextResponse } from "next/server";
import { hyperionLeadInsert } from "@/actions/hyperion";

export async function GET(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get("hub.mode"),
      token = req.nextUrl.searchParams.get("hub.verify_token"),
      challenge = req.nextUrl.searchParams.get("hub.challenge");

    if (mode && token) {
      if (mode === "subscribe" && token === "Hyperion") {
        console.log("FACEBOOK_VERIFIED");
        return new NextResponse(challenge, { status: 200 });
      } else {
        return new NextResponse("Data did not match", { status: 403 });
      }
    }
  } catch (error) {
    console.log("FACEBOOK_VERIFY_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const j = await req.json();
    const newLead = await hyperionLeadInsert({...j})
    
    if (newLead.error) {
      return new NextResponse(newLead.error, { status: 500 });
    }
    return new NextResponse(newLead.success, { status: 200 });
  } catch (error) {
    console.log("FACEBOOK_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
