"use client";
import React from "react";
import Link from "next/link";
import { ShortGptConversation } from "@/types";
import { formatDistance } from "date-fns";
import { formatDate } from "@/formulas/dates";

export const GptConversationCard = ({
  conversation,
}: {
  conversation: ShortGptConversation;
}) => {
  return (
    <Link
      href={`/chatbot/${conversation.id}`}
      className="flex flex-col border rounded-xl overflow-hidden p-2 hover:bg-secondary cursor-pointer"
    >
      <div className="flex justify-end">
        <p className="text-xs text-right">
          {formatDate(conversation.updatedAt)}
          {/* {formatDistance(conversation.updatedAt, new Date(), {
              addSuffix: true,
            })} */}
        </p>
      </div>
      <div className="overflow-ellipsis">
        <span className=" text-muted-foreground text-sm truncate overflow-hidden">
          {conversation.lastMessage?.content || "Start Conversation"}
        </span>
      </div>
    </Link>
  );
};
