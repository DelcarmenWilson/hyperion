import { leadStatusGetAllByAgentIdDefault } from "@/data/lead";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user } = body;
    const leadstatus = await leadStatusGetAllByAgentIdDefault(user);

    return NextResponse.json(leadstatus);
  } catch (error) {
    console.log("[LEADSTATUS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
