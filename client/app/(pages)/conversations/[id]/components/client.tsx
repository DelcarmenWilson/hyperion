"use client";
import { MessageSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useConversationData } from "../../hooks/use-conversation";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Header } from "./header";
import { SmsBody } from "@/components/phone/sms/body";
import { SmsForm } from "@/components/phone/sms/form";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import FormInput from "@/components/phone/sms/form-input";

const ConversationClient = () => {
  const user = useCurrentUser();
  const { conversation, isFetchingConversation } = useConversationData();

  if (!conversation) return null;

  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>
        <SkeletonWrapper isLoading={isFetchingConversation}>
          <Header lead={conversation.lead} />
        </SkeletonWrapper>
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1 gap-2 overflow-hidden !p-0">
        <SkeletonWrapper isLoading={isFetchingConversation}>
          <SmsBody />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={isFetchingConversation}>
          {/* <SmsForm /> */}
          <FormInput placeholder="Your Message..." />
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
};

export default ConversationClient;
