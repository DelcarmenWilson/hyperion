"use client";

import { MessageSquare } from "lucide-react";
import { FullGptConversation } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GptConversationBody } from "./body";
import { GptConversationForm } from "./form";

type ConversationClientProps = {
  conversation: FullGptConversation | null;
};

const ConversationClient = ({ conversation }: ConversationClientProps) => {
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1 p-2 gap-2 overflow-hidden">
        {conversation && (
          <>
            <GptConversationBody
              conversationId={conversation.id}
              initMessages={conversation.messages}
            />
            <GptConversationForm conversationId={conversation.id} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationClient;
