import { tokenGenerator } from "@/lib/twilio/handler";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body=await req.json()
    return NextResponse.json(tokenGenerator(body.identity));
  } catch (error) {
    console.log("[TOKEN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}