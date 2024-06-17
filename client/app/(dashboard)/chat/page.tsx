import { ChatsClient } from "./components/client";
import { Card, CardContent } from "@/components/ui/card";
import { chatsGetByUserId } from "@/actions/chat";
import { EmptyCard } from "@/components/reusable/empty-card";

const ChatsPage = async () => {
  const chats = await chatsGetByUserId();
  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <ChatsClient initChats={chats} />
        <EmptyCard
          title={chats.length > 1 ? "Select a Chat" : "Start a new Chat"}
        />
      </CardContent>
    </Card>
  );
};

export default ChatsPage;
