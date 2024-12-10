"use client";
import { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { useChatData } from "@/hooks/chat/use-chat";

import { Card, CardContent } from "@/components/ui/card";
import ChatForm from "@/components/chat/info/form";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Header } from "./components/header";
import { MessageList } from "@/components/chat/info/message-list";

const ChatsPage = () => {
  const { chatId, setChatId } = useChatStore();
  const { onFullChatsGet } = useChatData();
  const { fullChats } = onFullChatsGet();

  //set the intial full chat
  useEffect(() => {
    if (!fullChats?.length) return;
    setChatId(fullChats[0].id);
  }, [fullChats]);
  return (
    <>
      {chatId ? (
        <Card className="flex flex-col flex-1 relative overflow-hidden">
          <div className="flex items-center mb-2 border-b overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="bg-accent p-4 rounded-br-lg">
                <MessageSquare size={16} className="text-primary" />
              </div>
            </div>
            <Header />
          </div>
          <CardContent className="flex flex-col flex-1 !p-2 gap-2 overflow-hidden">
            <MessageList />
            <ChatForm placeholder="Your Message..." />
          </CardContent>
        </Card>
      ) : (
        <EmptyCard
          title={fullChats?.length ? "Select a Chat" : "Start a new Chat"}
        />
      )}
    </>
  );
};

export default ChatsPage;
