import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAssitantForUser } from "@/actions/user";
import { LeadCommunicationType } from "@/types/lead";

export async function POST(req: Request) {
  try {
    const agentId = await getAssitantForUser();
    if (!agentId) return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();
    const { leadId } = body;

    const conversation = await db.leadConversation.findFirst({
      where: { leadId, agentId },
      include: { communications: {where:{type:{not:LeadCommunicationType.SMS}}} },
    });
    if (!conversation) return NextResponse.json([]);

    return NextResponse.json(conversation.communications);
  } catch (error) {
    console.log("LEAD_MESSAGES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
