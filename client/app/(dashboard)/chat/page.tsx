import { ShortChat } from "@/types";

import { ChatsClient } from "./components/client";
import { Card, CardContent } from "@/components/ui/card";
import { chatsGetByUserId } from "@/data/chat";
import { EmptyCard } from "@/components/reusable/empty-card";

const ChatsPage = async () => {
  const chats = await chatsGetByUserId();
  //@ts-ignore
  const formattedChats: ShortChat[] = chats.map((chat) =>
    chat.chats.map((ct) => ({
      id: ct.id,
      name: ct.name,
      icon: ct.icon,
      isGroup: ct.isGroup,
      lastMessage: ct.lastMessage,
      updatedAt: ct.updatedAt,
    }))
  );

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <ChatsClient initChats={formattedChats} />
        <EmptyCard
          title={chats.length > 1 ? "Select a Chat" : "Start a new Chat"}
        />
      </CardContent>
    </Card>
  );
};

export default ChatsPage;
