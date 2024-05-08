import { NextResponse } from "next/server";
import { client } from "@/lib/twilio/config";
import { currentRole } from "@/lib/auth";

export async function POST(req: Request) {
  const role = await currentRole();
  if (!role || role == "USER") {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const conferences = await client.conferences.list();

  return NextResponse.json(conferences, { status: 200 });
}
