import { ShortConversation } from "@/types";
import { ConversationsClient } from "./components/client";
import { conversationsGetByUserId } from "@/data/conversation";

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
  return <ConversationsClient convos={formattedConversations} />;
};

export default ConversationsPage;
