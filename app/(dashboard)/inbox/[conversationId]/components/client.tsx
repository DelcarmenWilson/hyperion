"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { FullConversation } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Body } from "./body";
import { Form } from "./form";
import { Header } from "./header";

type ConversationClientProps = {
  conversation: FullConversation;
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
        <Header lead={conversation.lead} />
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1  gap-2 overflow-hidden">
        <Body initialData={conversation!} />
        <Form
          disabled={conversation.lead.status == "Do_Not_Call"}
          phone={conversation.lead.cellPhone}
          defaultPhone={conversation.lead.defaultNumber}
        />
      </CardContent>
    </Card>
  );
};

export default ConversationClient;
