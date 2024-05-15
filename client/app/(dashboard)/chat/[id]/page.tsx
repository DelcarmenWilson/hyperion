import { chatGetById, chatsGetByUserId } from "@/data/chat";
import ChatClient from "./components/client";
import { ChatsClient } from "../components/client";
import { Card, CardContent } from "@/components/ui/card";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const chats = await chatsGetByUserId();
  const chat = await chatGetById(params.id);

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0">
      <CardContent className="flex h-full gap-2 overflow-hidden p-0">
        <ChatsClient initChats={chats} />
        <ChatClient chat={chat!} />
      </CardContent>
    </Card>
  );
};

export default ChatPage;
