import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { message, conversationId,hasSeen } = body;

    const newMessage = await db.message.create({
      data: {
        role: "assistant",
        content: message,
        hasSeen: hasSeen||false,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender:{connect:{id:user.id}}
      },
    });

    const updatedConversation = await db.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        messages: {
          connect: { id: newMessage.id },
        },
      },
      include: { agent: true, messages: true },
    });

    await pusherServer.trigger(conversationId,'messages:new',newMessage)

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log("MESSAGES_POST", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
