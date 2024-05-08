import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

import { client } from "@/lib/twilio/config";
import { pusherServer } from "@/lib/pusher";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { phone, message, conversationId, from, hasSeen } = body;

    if (!user?.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!phone) {
      return new NextResponse("Phone is requiered", { status: 400 });
    }

    if (!message) {
      return new NextResponse("Message is requiered", { status: 400 });
    }

    const result = await client.messages.create({
      body: message,
      from: from,
      to: phone,
    });

    const newMessage = await db.message.create({
      data: {
        role: "assistant",
        content: message,
        hasSeen: hasSeen || false,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        senderId: user.id,
        sid: result.sid,
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

    await pusherServer.trigger(conversationId, "messages:new", newMessage);
    // return NextResponse.json(newMessage);
    return NextResponse.json(result);
  } catch (error) {
    console.log("[SMSPOST_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
