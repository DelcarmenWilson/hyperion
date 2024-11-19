import { cn } from "@/lib/utils";
import { Ban, Check, CheckCheck, LucideIcon, X } from "lucide-react";
import Image from "next/image";

import { LeadMessage } from "@prisma/client";
import { formatDistance } from "date-fns";
import { MessageType } from "@/types/message";
import { Message } from "@/components/global/message/message";

type MessageCardProps = {
  message: LeadMessage;
  username: string;
};

const setStatus = (status: string): LucideIcon => {
  switch (status) {
    case "failed":
      return X;
    case "undelivered":
      return Ban;
    case "delivered":
    case "received":
      return CheckCheck;
    default:
      return Check;
  }
};

const setBg = (role: string): { bg: string; pos: boolean } => {
  switch (role) {
    case "user":
      return { bg: "bg-primary text-background", pos: false };
    default:
      return { bg: "bg-accent", pos: true };
  }
};

export const MessageCard = ({ message, username }: MessageCardProps) => {
  const isOwn = setBg(message.role);
  const Icon = setStatus(message.status);

  return (
    <div className={cn("flex flex-col group mb-2", isOwn.pos && "items-end")}>
      <div className=" text-xs italic px-2">
        <span>{message.type===MessageType.TITAN? "Titan":username}</span>{" "}

        <span className=" text-muted-foreground">
          {formatDistance(message.createdAt, new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div
        className={cn(
          "relative text-sm max-w-[60%] w-fit rounded-md py-2 px-3 text-wrap  break-words",
          isOwn.bg
        )}
      >
        {message.attachment && (
          <Image
            height={100}
            width={100}
            src={message.attachment}
            alt="Chat Image"
          />
        )}
        {message.content}
        <div
          className={cn("absolute bottom-0 right-0", isOwn.pos && "opacity-0")}
        >
          <Icon size={14} />
        </div>
      </div>
    </div>
  );
};
