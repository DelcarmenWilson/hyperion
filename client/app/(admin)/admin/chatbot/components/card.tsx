"use client";
import React from "react";
import Link from "next/link";
import { ShortGptConversation } from "@/types";
import { formatDistance } from "date-fns";
import { formatDate } from "@/formulas/dates";
import { cn } from "@/lib/utils";

type Props = {
  conversation: ShortGptConversation;
  active: boolean;
};

export const GptConversationCard = ({ conversation, active }: Props) => {
  return (
    <Link
      href={`/chatbot/${conversation.id}`}
      className={cn(
        "flex flex-col border rounded-xl overflow-ellipsis p-2 hover:bg-secondary cursor-pointer",
        active && "bg-secondary"
      )}
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
    </Link>
  );
};
