"use client";
import { MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { ChatBody } from "@/components/chat/body";
import { ChatForm } from "@/components/chat/form";
import { useChat, useChatData } from "@/hooks/use-chat";
import { EmptyCard } from "@/components/reusable/empty-card";
import { useEffect } from "react";
import { Header } from "./components/header";
import FormInput from "./components/form-input";


const ChatsPage = () => {
  const { chatId, setChatId } = useChat();
  const { fullChats } = useChatData(chatId!);
  useEffect(() => {
    if (fullChats) {
      setChatId(fullChats[0].id);
    }
  }, []);
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
          <CardContent className="flex flex-col flex-1 p-2 gap-2 overflow-hidden">
            <ChatBody />
            {/* <ChatForm /> */}
            <FormInput placeholder="Your Message..." />
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
