import { InboxColumn } from "./components/columns";
import { InboxClient } from "./components/client";
import { conversationsGetByUserId } from "@/data/conversation";

const InboxPage = async () => {
  const conversations = await conversationsGetByUserId();
  const formattedConversations: InboxColumn[] = conversations.map(
    (conversation) => ({
      id: conversation.id,
      fullName: `${conversation.lead.firstName} ${conversation.lead.lastName}`,
      disposition: "",
      cellPhone: conversation.lead.cellPhone,
      message: conversation.lastMessage?.content!,
      updatedAt: conversation.updatedAt,
      unread: conversation.messages.filter((message) => !message.hasSeen)
        .length,
    })
  );
  return <InboxClient convos={formattedConversations} />;
};

export default InboxPage;
