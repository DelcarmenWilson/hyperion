import {
  conversationGetById,
  conversationsGetByUserId,
} from "@/data/conversation";
import ConversationClient from "./components/client";
import { ShortConversation } from "@/types";
import { ConversationsClient } from "../components/client";
import { Card, CardContent } from "@/components/ui/card";
import { ConversationLeadInfo } from "./components/lead-info";

const ConversationPage = async ({ params }: { params: { id: string } }) => {
  const conversations = await conversationsGetByUserId();
  const conversation = await conversationGetById(params.id);

  const formattedConversations: ShortConversation[] = conversations.map(
    (conversation) => ({
      id: conversation.id,
      firstName: conversation.lead.firstName,
      lastName: conversation.lead.lastName,
      disposition: "",
      cellPhone: conversation.lead.cellPhone,
      message: conversation.lastMessage!,
      updatedAt: conversation.updatedAt,
      unread: conversation.messages.filter((message) => !message.hasSeen)
        .length,
    })
  );
  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex gap-2 overflow-hidden p-0">
        <ConversationsClient convos={formattedConversations} />
        <ConversationClient conversation={conversation!} />
        <ConversationLeadInfo size="sm" lead={conversation?.lead!} />
      </CardContent>
    </Card>
  );
};

export default ConversationPage;
