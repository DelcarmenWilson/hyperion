import { cn } from "@/lib/utils";
import { Ban, Check, CheckCheck, LucideIcon, X } from "lucide-react";
import Image from "next/image";

import { formatDistance } from "date-fns";
import { MessageType } from "@/types/message";

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

const setBg = (type: MessageType): { bg: string; pos: boolean } => {
  switch (type) {
    case MessageType.LEAD:
      return { bg: "bg-primary text-background", pos: false };
    case MessageType.AGENT:
      return { bg: "bg-accent", pos: true };
    default:
      return {
        // bg: "bg-radial-gradient from-slate-500  to-white ",
        bg: "bg-gradient-to-tr from-slate-500  to-background",
        pos: true,
      };
  }
};

type MessageCardProps = {
  id: string;
  body: string | null;
  attachment: string | null;
  role: string;
  status: string;
  from: string;
  createdAt: Date;
  username: string;
};

export const MessageCard = ({
  id,
  body,
  attachment,
  role,
  status,
  from,
  createdAt,
  username,
}: MessageCardProps) => {
  const isOwn = setBg(from as MessageType);
  const Icon = setStatus(status);

  return (
    <div className={cn("flex flex-col group mb-2", isOwn.pos && "items-end")}>
      <div className=" text-xs italic px-2">
        <span>{from === MessageType.TITAN ? "Titan" : username}</span>{" "}
        <span className="text-muted-foreground ">
          {formatDistance(createdAt, new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div
        className={cn(
          "relative text-sm max-w-[70%] w-fit rounded py-2 px-3 text-wrap break-words",
          isOwn.bg
        )}
      >
        {attachment && (
          <Image height={100} width={100} src={attachment} alt="Chat Image" />
        )}
        {body}
        <div
          className={cn("absolute bottom-0 right-1", isOwn.pos && "opacity-0")}
        >
          <Icon size={14} />
        </div>
      </div>
    </div>
  );
};
