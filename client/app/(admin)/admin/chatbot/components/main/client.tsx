"use client";
import { MessageSquare, Trash } from "lucide-react";
import { useChatbotData } from "../../hooks/use-chatbot";

import { EmptyCard } from "@/components/reusable/empty-card";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChatbotConversationBody } from "./body";
import { ChatbotConversationForm } from "./form";
import { Button } from "@/components/ui/button";

const ChatbotClient = () => {
  const { conversation } = useChatbotData();

  return (
    <>
      {conversation ? (
        <Card className="flex flex-col flex-1 relative overflow-hidden">
          <div className="flex items-center justify-between  mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-accent p-4 rounded-br-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>

            <Button variant="destructive" size="icon">
              <Trash />
            </Button>
          </div>
          <Separator />
          <CardContent className="flex flex-col flex-1 p-2 gap-2 overflow-hidden">
            <ChatbotConversationBody initMessages={conversation.messages} />
            <ChatbotConversationForm />
          </CardContent>
        </Card>
      ) : (
        <EmptyCard
          title={"It's good to see you!! Speak your mind and Get Answers"}
        />
      )}
    </>
  );
};

export default ChatbotClient;
