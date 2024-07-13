import { chatGetById, chatGetBUserId as chatGetByUserId } from "@/actions/chat";
import { userEmitter } from "@/lib/event-emmiter";
import { useChat } from "@/hooks/use-chat";
import { FullChat } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { MessageCard } from "./message";

export const ChatBody = () => {
  const { user, setChatId, chatId } = useChat();
  const queryClient = useQueryClient();
  const { data: chat } = useQuery<FullChat | null>({
    queryKey: ["agentMessages", `user-${user?.id}`],
    queryFn: () => chatGetByUserId(user?.id as string),
  });

  const inValidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["agentMessages", `user-${user?.id}`],
    });
  };

  useEffect(() => {
    if (!chat) return;
    setChatId(chat.messages[0].id);
  }, [chat]);

  useEffect(() => {
    userEmitter.on("chatMessageInserted", (newMessage) => {
      inValidate();
      console.log(newMessage);
    });
  });

  return (
    <div className="flex-1 flex flex-col border gap-2 p-1 rounded overflow-y-auto">
      {chat?.messages?.map((message) => (
        <MessageCard
          key={message.id}
          username={message.sender.userName}
          content={message.content!}
          createdAt={message.createdAt}
        />
      ))}
    </div>
  );
};
