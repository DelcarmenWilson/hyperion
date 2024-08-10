import { ShortConversation } from "@/types";
import { GptConversationsClient } from "./components/client";
import { Card, CardContent } from "@/components/ui/card";

import { EmptyCard } from "@/components/reusable/empty-card";
import { gptConversationsGetByUserId } from "@/actions/test";

const ConversationsPage = async () => {
  const conversations = await gptConversationsGetByUserId();

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <GptConversationsClient initConversations={conversations} />
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
