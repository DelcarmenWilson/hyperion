"use client";

import { MessageSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FullConversation } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "./header";
import { SmsBody } from "@/components/phone/sms/body";
import { SmsForm } from "@/components/phone/sms/form";

type ConversationClientProps = {
  conversation: FullConversation;
};

const ConversationClient = ({ conversation }: ConversationClientProps) => {
  const user = useCurrentUser();
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>
        <Header lead={conversation.lead} />
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1 p-2 gap-2 overflow-hidden">
        <SmsBody
          initConversationId={conversation.id}
          initMessages={conversation.messages}
          leadName={conversation.lead.firstName}
          userName={user?.name as string}
        />
        <SmsForm lead={conversation.lead} conversationId={conversation.id} />
      </CardContent>
    </Card>
  );
};

export default ConversationClient;
