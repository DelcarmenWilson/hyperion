"use client";
import { MessageSquare } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";

import { FullChat } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

import { Header } from "./header";
import { ChatBody } from "./body";
import { ChatForm } from "./form";

type ChatClientProps = {
  chat: FullChat;
};

const ChatClient = ({ chat }: ChatClientProps) => {
  const user = useCurrentUser();
  const otherUser = chat.userOneId == user?.id! ? chat.userTwo : chat.userOne;
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden">
      <div className="flex items-center mb-2 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquare size={16} className="text-primary" />
          </div>
        </div>
        <Header user={otherUser} />
      </div>

      <CardContent className="flex flex-col flex-1 p-2 gap-2 overflow-hidden">
        <ChatBody
          chatId={chat.id}
          initMessages={chat.messages}
          otherUser={otherUser}
        />
        <ChatForm chatId={chat.id} />
      </CardContent>
    </Card>
  );
};

export default ChatClient;
