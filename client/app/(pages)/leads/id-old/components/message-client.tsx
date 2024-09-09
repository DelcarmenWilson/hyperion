import { PictureInPicture, Send } from "lucide-react";

import { FullConversation } from "@/types";

import { MessageBox } from "@/components/reusable/message-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BodyProps = {
  initialData?: FullConversation;
};

export const Body = ({ initialData }: BodyProps) => {
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="flex flex-col items-center h-[400px] w-full">
        <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4 overflow-hidden overflow-y-auto ">
          {!initialData?.messages.length}
          {
            <p className="text-center text-muted-foreground">
              No sms have been sent
            </p>
          }
          {initialData?.messages.map((message, i) => (
            <MessageBox
              key={message.id}
              data={message}
              username={
                message.role === "user"
                  ? initialData.lead.lastName
                  : message.sender?.userName!
              }
              isLast={i === initialData.messages.length - 1}
            />
          ))}
        </ScrollArea>
        <div className="flex items-center p-2 w-full gap-2">
          <PictureInPicture className="h-5 w-5" />
          <Input className="flex-1" />
          <Button className="rounded-full" size="icon">
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
