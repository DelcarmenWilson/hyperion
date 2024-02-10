import * as z from "zod";
import { NextResponse } from "next/server";
import { MessageSchema } from "@/schemas";
import { messageInsert } from "@/actions/message";
import { chatFetch } from "@/actions/chat";
import { db } from "@/lib/db";
import { defaultOptOut } from "@/placeholder/chat";

export async function POST(req: Request) {
  const body = await req.formData();

  var j: any = {};
  body.forEach(function (value, key) {
    key = key.replace('"', "");
    j[key] = value;
  });

  const conversation = await db.conversation.findFirst({
    where: {
      lead: {
        cellPhone: j.From,
      },
    },
  });

  const textFromLead: z.infer<typeof MessageSchema> = {
    role: "user",
    content: j.Body,
    conversationId: conversation?.id!,
    senderId: conversation?.agentId!,
    hasSeen: false,
  };

  if (!conversation) {
    return new NextResponse(null, { status: 200 });
  }

  await messageInsert(textFromLead);

  switch (textFromLead.content.toLowerCase()) {
    case "stop":
      await db.lead.update({where:{id:conversation.leadId},data:{status:"Do_Not_Call"}})
      return new NextResponse(defaultOptOut.confirm, { status: 200 });
    case "reset":
      await db.conversation.delete({ where: { id: conversation.id } });
      return new NextResponse("Conversation has been reset", { status: 200 });
  }

  const messages = await db.message.findMany({
    where: { conversationId: conversation.id },
  });

  let chatmessages = messages.map((message) => {
    return { role: message.role, content: message.content };
  });
  chatmessages.push({role:textFromLead.role,content:textFromLead.content});

  const chatresponse = await chatFetch(chatmessages);
  const { role, content } = chatresponse.choices[0].message;

  if (!content) {
    return new NextResponse("Thank you for your message", { status: 200 });
  }

  setTimeout(async () => {
    await messageInsert({
      role,
      content,
      conversationId: conversation.id,
      senderId: conversation.agentId,
      hasSeen: false,
    });
  }, 5000);

  return new NextResponse(content, { status: 200 });
}
