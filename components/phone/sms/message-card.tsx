import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";

import { FullMessage } from "@/types";

interface MessageCardProps {
  data: FullMessage;
  username: string;
}

export const MessageCard = ({ data, username }: MessageCardProps) => {
  const isOwn = data.role != "user";
  return (
    <div className={cn("flex flex-col mb-2 group", isOwn && "items-end")}>
      <span className="hidden group-hover:block text-sm italic">
        {username} {format(data.createdAt, "p")}
      </span>
      <div
        className={cn(
          "text-sm max-w-[60%] rounded-md py-2 px-3 text-wrap  break-words",
          isOwn ? "bg-primary text-background" : "bg-accent"
        )}
      >
        {data.attachment && (
          <Image
            height={100}
            width={100}
            src={data.attachment}
            alt="Chat Image"
          />
        )}
        {data.content}
      </div>
    </div>
  );
};
