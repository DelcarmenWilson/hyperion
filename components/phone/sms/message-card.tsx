import { cn } from "@/lib/utils";
import { FullMessage } from "@/types";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface MessageCardProps {
  data: FullMessage;
  username: string;
}

export const MessageCard = ({ data, username }: MessageCardProps) => {
  const session = useSession();

  const isOwn = data.role != "user";

  const container = cn(isOwn && "order-2 ", "mb-2");

  const body = cn("flex flex-col mb-2 group", isOwn && "items-end");

  const message = cn(
    "text-sm max-w-[60%]",
    isOwn ? "bg-primary text-background" : "bg-accent",
    "rounded-md py-2 px-3 text-wrap  break-words"
  );

  return (
    <div>
      <div className={body}>
        <span className="hidden group-hover:block text-sm italic">
          {username} {format(new Date(data.createdAt), "p")}
        </span>
        <div className={message}>{data.content}</div>
      </div>
    </div>
  );
};
