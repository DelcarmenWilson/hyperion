import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useChatData, useChatStore } from "@/hooks/use-chat";
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
  const date = new Date(dateStr);

  if (isToday(dateStr)) return "Today";
  if (isYesterday(dateStr)) return "Yesterday";

  return formatDate(dateStr, "EEEE, MMM d ");
};

export const MessageList = ({}) => {
  const currentUser = useCurrentUser();
  const { user, chatId } = useChatStore();
  const { chat, chatIsFetching, chatIsLoading } = useChatData(chatId as string);
  const { bottomRef, parentRef, isVisible, scrollToBottom } =
    useScroller(chatIsFetching);
  const [editingId, setEditingId] = useState<string | null>(null);
  const groupedMessages = chat?.messages.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);

    return groups;
  }, {} as Record<string, FullChatMessage[]>);
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
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-background px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm ">
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
                  //TODO change attachment to image and change content to body
                  <Message
                    key={message.id}
                    id={message.id}
                    userId={message.senderId}
                    userImage={message.sender.image}
                    userName={message.sender.userName}
                    isAuthor={currentUser?.id == message.senderId}
                    body={message.body}
                    image={message.image}
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
              title={`No messages have been sent between you and ${user?.userName} `}
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
