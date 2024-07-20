import { ChatsClient } from "./components/chats/client";
import { Card, CardContent } from "@/components/ui/card";
import ChatClient from "./components/main-chat/client";

const ChatsPage = async () => {
  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <ChatsClient />
        <ChatClient />
      </CardContent>
    </Card>
  );
};

export default ChatsPage;
