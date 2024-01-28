"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { FullConversationType } from "@/types";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { Body } from "./body";
import { Form } from "./form";
import { Header } from "./header";

interface ConversationClientProps {
  conversation: FullConversationType;
}

const ConversationClient = ({ conversation }: ConversationClientProps) => {
  return (
    <Card className="flex flex-col flex-1 relative">
      <div className="flex  items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>

        <Header conversation={conversation} />
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1 items-center space-y-0 gap-2 py-2">
        <Body initialData={conversation!} />
        <Form />
      </CardContent>
    </Card>
  );
};

export default ConversationClient;
