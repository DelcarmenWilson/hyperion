import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useChatActions, useChatData } from "@/hooks/chat/use-chat";
import { useScroller } from "@/hooks/use-scroller";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

import { FullChatMessage } from "@/types";

import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import { Message } from "@/components/global/message/message";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { formatDate } from "@/formulas/dates";
import { useState } from "react";
const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
  if (isToday(dateStr)) return "Today";
  if (isYesterday(dateStr)) return "Yesterday";
  return formatDate(dateStr, "EEEE, MMM d ");
};

export const MessageList = ({}) => {
  const user = useCurrentUser();
  const { onChatGet } = useChatData();
  const { chat, chatIsFetching, chatIsLoading } = onChatGet();

  const { onChatDelete, chatDeleting } = useChatActions();
  const { bottomRef, parentRef, isVisible, scrollToBottom } =
    useScroller(chatIsFetching);
  const [editingId, setEditingId] = useState<string | null>(null);

  const groupedMessages = chat?.messages.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateKey = format(date, "MM-dd-yyyy");
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, FullChatMessage[]>);
  const otherUser =
    chat?.userOneId == user?.id! ? chat?.userTwo : chat?.userOne;
  return (
    //TODO make this use the scroll area
    <div className="relative flex-1 border p-1 rounded overflow-hidden">
      <div
        ref={parentRef}
        className="flex flex-col-reverse h-full pb-4 overflow-y-auto"
      >
        <div className="p-2" ref={bottomRef}></div>
        <SkeletonWrapper isLoading={chatIsLoading}>
          {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
              <div className="relative text-center my-2">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-muted-foreground" />
                <span className="relative inline-block bg-background px-4 py-1 rounded-full text-xs border border-muted-foreground shadow-sm ">
                  {formatDateLabel(dateKey)}
                </span>
              </div>
              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const isCompact =
                  prevMessage &&
                  prevMessage.senderId == message.senderId &&
                  differenceInMinutes(
                    message.createdAt,
                    prevMessage.createdAt
                  ) < TIME_THRESHOLD;

                return (
                  <Message
                    key={message.id}
                    id={message.id}
                    userId={message.senderId}
                    userImage={message.sender.image}
                    userName={message.sender.userName}
                    isAuthor={user?.id == message.senderId}
                    body={message.body}
                    image={message.image}
                    reactions={message.reactions}
                    deletedBy={message.deletedBy}
                    createdAt={message.createdAt}
                    updatedAt={message.updatedAt}
                    isEditing={editingId == message.id}
                    setEditingId={setEditingId}
                    isCompact={isCompact}
                  />
                );
              })}
            </div>
          ))}
          {chat?.messages.length == 0 && (
            <EmptyCard
              title={`No messages have been sent between you and ${otherUser?.userName} `}
              // subTitle={
              //   <Button
              //     onClick={() => onChatDelete(chat.id)}
              //     disabled={chatDeleting}
              //   >
              //     Delete Chat
              //   </Button>
              // }
            />
          )}
        </SkeletonWrapper>
      </div>
      <Button
        className={cn(
          "absolute bottom-2 right-6 opacity-0",
          isVisible && "opacity-100"
        )}
        variant="ghost"
        onClick={() => scrollToBottom(true)}
        size="icon"
      >
        <ChevronDown size={16} />
      </Button>
    </div>
  );
};
