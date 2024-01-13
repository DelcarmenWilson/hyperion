import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import twilio from "twilio";

const sid = process.env.TWILIO_CLIENT_ID;
const token = process.env.TWILIO_CLIENT_TOKEN;
const from=process.env.TWILIO_PHONE

export async function POST(req: Request) {
  try {
    const user = currentUser();
    const body = await req.json();
    const { phone, message } = body;
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!phone) {
      return new NextResponse("Phone is requiered", { status: 400 });
    }

    if (!message) {
      return new NextResponse("Message is requiered", { status: 400 });
    }

    const client = twilio(sid, token);
    const result = await client.messages.create({
      body: message,
      from: from,
      to: phone,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.log("[SENDSMD_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
