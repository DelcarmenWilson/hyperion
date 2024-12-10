"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/stores/chatbot-store";

import { ShortChatbotConversation } from "@/types";
import { formatDistance } from "date-fns";

type Props = {
  conversation: ShortChatbotConversation;
  active: boolean;
};

export const ChatbotConversationCard = ({ conversation, active }: Props) => {
  const { setChatId } = useChatbot();
  return (
    <div
      className={cn(
        "flex flex-col border rounded-xl overflow-ellipsis p-2 hover:bg-secondary cursor-pointer",
        active && "bg-secondary"
      )}
      onClick={() => setChatId(conversation.id)}
    >
      <p className="text-xs text-right">
        {/* {formatDate(conversation.updatedAt)} */}
        {formatDistance(conversation.updatedAt, new Date(), {
          addSuffix: true,
        })}
      </p>
      <p className=" text-muted-foreground text-sm truncate">
        {conversation.lastMessage?.content || "Start Conversation"}
      </p>
    </div>
  );
};
