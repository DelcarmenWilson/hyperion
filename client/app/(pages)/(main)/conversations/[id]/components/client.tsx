"use client";
import { MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "./header";
import { SmsBody } from "@/components/phone/sms/body";
import FormInput from "@/components/phone/sms/form-input";
import { useConversationId } from "@/hooks/use-conversation";

const ConversationClient = () => {
  const { conversationId } = useConversationId();
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>
        <Header />
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1 gap-2 overflow-hidden rounded-none !p-0">
        <SmsBody conversationId={conversationId} />
        <FormInput placeholder="Your Message..." />
      </CardContent>
    </Card>
  );
};

export default ConversationClient;
