import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { PictureInPicture } from "lucide-react";

import { FullConversationType } from "@/types";

import { MessageBox } from "@/components/reusable/message-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface BodyProps {
  initialData: FullConversationType;
}

export const Body = ({ initialData }: BodyProps) => {
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="flex flex-col items-center h-[400px] w-[50%]">
        <ScrollArea className="flex flex-col flex-1 w-full border rounded-sm p-4 overflow-hidden overflow-y-auto ">
          {initialData.messages.map((message, i) => (
            <MessageBox
              key={message.id}
              data={message}
              username={
                message.role === "user"
                  ? initialData.lead.lastName
                  : (initialData.users[0].name as string)
              }
              isLast={i === initialData.messages.length - 1}
            />
          ))}
        </ScrollArea>
        <div className="flex items-center p-4 border w-full gap-2">
          <PictureInPicture className="h-5 w-5" />
          <Input className="flex-1" />
          <div className="rounded-full bg-primary text-accent p-2">
            <PaperPlaneIcon className=" h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};