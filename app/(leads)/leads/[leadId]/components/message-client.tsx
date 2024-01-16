import { Message } from "@prisma/client";
import React from "react";
import { Message as Msg } from "./message";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PictureInPicture } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

interface MessageClientProps {
  initialData: Message[];
  userName: string;
  leadName: string;
}

export const MessageClient = ({
  initialData,
  userName,
  leadName,
}: MessageClientProps) => {
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="flex flex-col items-center h-[400px] w-[50%]">
        <ScrollArea className="flex flex-col flex-1 w-full border rounded-sm p-4 overflow-hidden overflow-y-auto ">
          {initialData.map((message) => (
            <Msg
              key={message.id}
              message={message.content}
              username={message.role === "user" ? leadName : userName}
              date={format(message.createdAt, "MM-dd-yyyy hh:mm")}
              position={
                message.role === "user" ? "justify-end" : "justify-start"
              }
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
