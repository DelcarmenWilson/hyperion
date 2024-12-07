import { getLead } from "@/actions/lead";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { callSid } = body;

    const leadId = (
      await db.call.findUnique({
        where: { id: callSid },
        select: { leadId: true },
      })
    )?.leadId;

    if (!leadId) {
      return NextResponse.json({});
    }
    const lead = await getLead(leadId);

    return NextResponse.json(lead);
  } catch (error) {
    console.log("LEADS_GET_DETAILS_BY_CALL", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
