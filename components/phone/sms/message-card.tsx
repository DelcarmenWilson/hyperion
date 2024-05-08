import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDistance } from "date-fns";

import { Message } from "@prisma/client";

type MessageCardProps = {
  message: Message;
  username: string;
};

function setBg(role: string): { bg: string; pos: boolean } {
  switch (role) {
    case "user":
      return { bg: "bg-accent", pos: false };
    default:
      return { bg: "bg-primary text-background", pos: true };
  }
}

export const MessageCard = ({ message, username }: MessageCardProps) => {
  const isOwn = setBg(message.role);

  return (
    <div className={cn("flex flex-col group mb-2", isOwn.pos && "items-end")}>
      <div className=" text-xs italic px-2">
        <span>{username}</span>{" "}
        <span className=" text-muted-foreground">
          {formatDistance(message.createdAt, new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div
        className={cn(
          "text-sm max-w-[60%] w-fit rounded-md py-2 px-3 text-wrap  break-words",
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
      </div>
    </div>
  );
};
