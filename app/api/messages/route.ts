import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { message, conversationId } = body;

    const newMessage = await db.message.create({
      data: {
        role: "assistant",
        content: message,
        hasSeen: { connect: { id: user.id } },
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
      include: { users: true, messages: true },
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log("MESSAGES_POST", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
