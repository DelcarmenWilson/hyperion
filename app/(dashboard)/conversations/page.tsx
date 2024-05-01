import { ShortConversation } from "@/types";
import { ConversationsClient } from "./components/client";
import { Card, CardContent } from "@/components/ui/card";
import { conversationsGetByUserId } from "@/data/conversation";
import { EmptyCard } from "@/components/reusable/empty-card";

const ConversationsPage = async () => {
  const conversations = await conversationsGetByUserId();
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
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <ConversationsClient convos={formattedConversations} />
        <EmptyCard
          title={
            conversations.length > 1
              ? "Select a Conversation"
              : "Start a new Conversation"
          }
        />
      </CardContent>
    </Card>
  );
};

export default ConversationsPage;
