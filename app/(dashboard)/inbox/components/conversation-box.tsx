import { useCallback, useMemo } from "react";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { LeadConversationType } from "@/types";
import { cn } from "@/lib/utils";

interface ConversationBoxProps {
  data: LeadConversationType;
  selected?: boolean;
}

export const ConversationBox = ({ data, selected }: ConversationBoxProps) => {
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/inbox/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  // const userEmail = useMemo(() => {
  //   return session.data?.user?.email;
  // }, [session.data?.user?.email]);

  //TODO last seen use memo if needed
  const lastMessageText = useMemo(() => {
    // if(lastMessage?.image){
    //     return 'Sent and Image'
    // }
    if (lastMessage.content) {
      return lastMessage.content;
    }

    return "Started a conversation";
  }, [lastMessage]);
  const initials = `${data.lead.firstName.substring(
    0,
    1
  )} ${data.lead.lastName.substring(0, 1)}`;
  const fullName = `${data.lead.firstName} ${data.lead.lastName}`;
  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-full relative flex items-center space-x-3 hover:bg-accent rounded-lg transition cursor-pointer p-3",
        selected ? "bg-accent" : "bg-background"
      )}
    >
      <span className="text-lg font-semibold flex justify-center items-center bg-primary text-accent dark:bg-accent dark:text-primary  rounded-full p-1 mr-2">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="focus-outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-muted-foreground">
              {fullName}
            </p>
            <p className="text-xs text-muted-foreground font-light">
              {format(new Date(lastMessage.createdAt), "p")}
            </p>
          </div>
          {/* <p
            className={cn(
              "truncate text-sm",
              lastMessage.hasSeen
                ? "text-muted-foreground"
                : "text-primary font-medium italic"
            )}
          > */}
          <p className={cn("truncate text-sm")}>{lastMessageText}</p>
        </div>
      </div>
    </div>
  );
};
