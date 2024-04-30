import { ShortConversation } from "@/types";
import { ConversationsClient } from "./components/client";
import { Card, CardContent } from "@/components/ui/card";
import { conversationsGetByUserId } from "@/data/conversation";
import Image from "next/image";

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
        <Card className="flex flex-1 flex-col w-full h-full overflow-hidden p-0">
          <CardContent className="flex-center flex-col h-full gap-2 text-muted-foreground opacity-50 overflow-hidden p-0">
            <Image
              height={80}
              width={80}
              className="w-[80px] h-[80px] grayscale"
              src="/logo3.png"
              alt="logo"
            />
            <h4>Select a Conversation</h4>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ConversationsPage;
