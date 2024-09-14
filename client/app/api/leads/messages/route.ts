import { states } from "@/constants/states";
import { userGetByAssistant } from "@/data/user";
import { reFormatPhoneNumber } from "@/formulas/phones";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const user = await currentUser();
   

    const body = await req.json();
    const {
      leadId
    } = body;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    let agentId = user.id;
    if (user.role == "ASSISTANT") {
      agentId = (await userGetByAssistant(user.id)) as string;
    }
    const conversation=await db.leadConversation.findFirst({where:{leadId,agentId},include:{messages:true}})
    if(!conversation)
    return NextResponse.json([]);
  
    return NextResponse.json(conversation.messages);
  } catch (error) {
    console.log("LEAD_MESSAGES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
