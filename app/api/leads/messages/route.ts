import { states } from "@/constants/states";
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

    const conversation=await db.conversation.findFirst({where:{leadId}})
    if(!conversation)
    return NextResponse.json([]);
  
    const messages = await db.message.findMany({
      where: {conversationId:conversation.id        
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log("LEAD_MESSAGES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
