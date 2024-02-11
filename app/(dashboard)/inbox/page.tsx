import { Users } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversationsGetByUserId } from "@/data/conversation";
import { InboxColumn } from "./components/columns";
import { InboxClient } from "./components/client";

const InboxPage = async () => {
  const conversations = await conversationsGetByUserId();
  const formattedConversations: InboxColumn[] = conversations.map(
    (conversation) => ({
      id: conversation.id,
      fullName: `${conversation.lead.firstName} ${conversation.lead.lastName}`,
      disposition: "",
      cellPhone: conversation.lead.cellPhone,
      message: conversation.lastMessage!,
      updatedAt: conversation.updatedAt,
      unread: conversation.messages.filter((message) => !message.hasSeen)
        .length,
    })
  );
  return (
    <>
      <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-4 rounded-br-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className=" text-sm text-muted-foreground">
              View Inbox
            </CardTitle>
          </div>
          {/* <InboxClient /> */}
        </div>

        <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
          <ScrollArea className="w-full flex-1 pr-5">
            <InboxClient convos={formattedConversations} />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

export default InboxPage;
