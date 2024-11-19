import { cn } from "@/lib/utils";
import { Ban, Check, CheckCheck, LucideIcon, X } from "lucide-react";
import Image from "next/image";

import { LeadMessage } from "@prisma/client";
import { formatDistance } from "date-fns";
import { MessageType } from "@/types/message";
import { Message } from "@/components/global/message/message";

type MessageCardProps = {
  message: LeadMessage;
};


export const AiCard = ({ message }: MessageCardProps) => {
  return (
    <div className="bg-gradient p-[2px]">
    <div className={cn("flex flex-col bg-white group items-end")}>
      <div className=" text-xs italic px-2">
        <span>Ai</span>{" "}

        <span className=" text-muted-foreground">
          {formatDistance(message.createdAt, new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div
        className={cn(
          "relative text-sm max-w-[60%] w-fit rounded-md py-2 px-3 text-wrap  break-words"
        )}
      >
   
        {message.content}
       
        
      </div>
    </div>
    </div>
  );
};
