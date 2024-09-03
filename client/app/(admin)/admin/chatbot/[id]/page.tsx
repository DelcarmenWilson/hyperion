import ConversationClient from "./components/client";
import { GptConversationsClient } from "../components/client";
import { Card, CardContent } from "@/components/ui/card";

import { gptConversationGetById } from "@/actions/test";

const ConversationPage = async ({ params }: { params: { id: string } }) => {
  const conversation = await gptConversationGetById(params.id);

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <GptConversationsClient activeConvo={params.id} />
        <ConversationClient conversation={conversation} />
      </CardContent>
    </Card>
  );
};

export default ConversationPage;
