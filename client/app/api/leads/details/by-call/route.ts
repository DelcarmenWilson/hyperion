import { getLead } from "@/actions/lead";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { callSid } = body;

    const leadId = (
      await db.leadCommunication.findUnique({
        where: { id: callSid },
        select: { conversation:{select:{leadId:true}} },
      })
    )?.conversation.leadId;

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
