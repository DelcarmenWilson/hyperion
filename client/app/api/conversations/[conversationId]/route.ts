import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const user = await currentUser();
    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { conversationId } = params;
    
  await db.leadConversation.delete({
      where: { id: conversationId,agentId:user.id },
    });

    return new NextResponse("Success", { status: 200 });
  } catch (error: any) {
    console.log("CONVERSATION_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

