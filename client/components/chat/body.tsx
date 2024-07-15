import { userEmitter } from "@/lib/event-emmiter";
import { useChat } from "@/hooks/use-chat";
import { FullChat } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { MessageCard } from "./message";
import { useCurrentUser } from "@/hooks/use-current-user";
import { chatGetById, chatGetBUserId } from "@/actions/chat";
import SkeletonWrapper from "../skeleton-wrapper";

export const ChatBody = () => {
  const currentUser = useCurrentUser();
  const { user, chatId } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: chat, isFetching } = useQuery<FullChat | null>({
    queryKey: ["agentMessages", `user-${user?.id}`],
    queryFn: () => chatGetById(chatId as string),
  });

  const inValidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["agentMessages", `user-${user?.id}`],
    });
  };

  useEffect(() => {
    userEmitter.on("chatMessageInserted", (newMessage) => {
      if (newMessage.chatId == chatId) inValidate();
    });
  });

  useEffect(() => {
    if (isFetching) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [user?.id, isFetching]);

  return (
    <div className="flex-1 flex flex-col border gap-2 p-1 rounded overflow-y-auto">
      <SkeletonWrapper isLoading={isFetching}>
        {chat?.messages?.map((message) => (
          <MessageCard
            key={message.id}
            username={message.sender.userName}
            content={message.content!}
            createdAt={message.createdAt}
            isOwn={currentUser?.id == message.senderId}
          />
        ))}
        <div className="p-2" ref={bottomRef}></div>
      </SkeletonWrapper>
    </div>
  );
};
