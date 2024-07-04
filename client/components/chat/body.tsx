import { chatGetById, chatGetBUserId } from "@/actions/chat";
import { userEmitter } from "@/lib/event-emmiter";
import { useChat } from "@/hooks/use-chat";
import { FullChat } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

export const ChatBody = () => {
  const { user, setChatId, chatId } = useChat();
  const queryClient = useQueryClient();
  const { data: chat } = useQuery<FullChat | null>({
    queryKey: ["agentMessages"],
    queryFn: () => chatGetBUserId(user?.id as string),
  });

  const inValidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["agentMessages"],
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
    <div className="flex-1 flex flex-col border rounded overflow-y-auto">
      {chat?.messages?.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  );
};
