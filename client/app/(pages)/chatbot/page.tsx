import { ShortConversation } from "@/types";
import { GptConversationsClient } from "./components/client";
import { Card, CardContent } from "@/components/ui/card";

import { EmptyCard } from "@/components/reusable/empty-card";
import { gptConversationsGetByUserId } from "@/actions/test";

const ConversationsPage = async () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <GptConversationsClient />
        <EmptyCard title={"Select or Start a new Conversation"} />
      </CardContent>
    </Card>
  );
};

export default ConversationsPage;
