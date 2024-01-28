import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullMessageType } from "@/types";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface MessageProps {
  data: FullMessageType;
  username: string;
  isLast: boolean;
}

export const MessageBox = ({ data, username, isLast }: MessageProps) => {
  const session = useSession();

  const isOwn = data.role != "user";
  // const seenList = (data.hasSeen || [])
  //   .filter((user) => user.email != data?.sender?.email)
  //   .map((user) => user.name)
  //   .join(", ");
  const senderName = data?.sender ? data.sender.username : username;
  const container = cn(isOwn && "order-2 ", "mb-2");

  const body = cn("flex flex-col mb-2", isOwn && "items-end");

  const message = cn(
    "text-sm max-w-[60%]",
    isOwn ? "bg-primary text-background" : "bg-accent",
    "rounded-md py-2 px-3 text-wrap  break-words"
  );

  return (
    <div>
      <div className={body}>
        <div className="gap-1 text-sm italic">
          <span>
            {senderName} {format(new Date(data.createdAt), "p")}
          </span>
        </div>
        <div className={message}>{data.content}</div>
      </div>
      {/* {isLast && isOwn && seenList.length > 0 && (
        <div className="text-xs font-light text-muted-foreground">
          {`Seen by ${seenList}`}
        </div>
      )} */}
    </div>
    // <div
    //   className={cn(
    //     "flex w-full",
    //     position === "start" ? "justify-start" : "justify-end"
    //   )}
    // >
    //   <Card
    //     className={cn(
    //       "flex flex-col mb-2 max-w-[45%]",
    //       position === "start" ? "" : "bg-accent"
    //     )}
    //   >
    //     <CardContent>
    //       <p className="text-muted-foreground text-sm text-right my-2">
    //         {date}
    //       </p>
    //       <p>{data.content}</p>
    //       <div className="flex justify-end">
    //         <Badge>{username}</Badge>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
  );
};
