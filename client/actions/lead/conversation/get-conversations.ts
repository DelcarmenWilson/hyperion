"use server";
import { db } from "@/lib/db";
import { ShortConversation } from "@/types";
import { getAssitantForUser } from "@/actions/user";

export const getConversations = async () => {

    const agentId = await getAssitantForUser();
    if (!agentId) throw new Error("Unauthenticated!");

    const conversations = await db.leadConversation.findMany({
      where: { agentId },
      include: {
        lead: true,
        lastMessage:true,
        messages: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const  formattedConversations: ShortConversation[] = conversations.map(
      (conversation) => ({
        ...conversation,
        firstName: conversation.lead.firstName,
        lastName: conversation.lead.lastName,
        disposition: "",
        cellPhone: conversation.lead.cellPhone,
        message: conversation.lastMessage?.content!,
        unread: conversation.messages.filter((message) => !message.hasSeen)
          .length,
      })
    );
    return formattedConversations;

};