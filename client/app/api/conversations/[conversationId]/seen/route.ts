import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const user = await currentUser();
    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { conversationId } = params;
    // Find the conversation
    const conversation = await db.leadConversation.findUnique({
      where: { id: conversationId },
      include: { 
        communications:true
        , agent: true },
    });

    if (!conversation) 
      return new NextResponse("Invalid Id", { status: 400 });
    

    //Find the last message
    const lastMessage = conversation.communications[conversation.communications.length - 1];
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    //Update seen of last message
    await db.leadMessage.updateMany({
      where: { conversationId: conversation.id },
      data: {
        hasSeen: true
      },
    });

    return NextResponse.json({status:200});
  } catch (error: any) {
    console.log("CONVERSATION_SEEN", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

