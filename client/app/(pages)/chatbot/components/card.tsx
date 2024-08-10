"use client";
import React from "react";
import Link from "next/link";
import { GptConversation } from "@prisma/client";
import { formatDistance } from "date-fns";

export const GptConversationCard = ({
  conversation,
}: {
  conversation: GptConversation;
}) => {
  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className="flex flex-col border rounded-xl overflow-hidden p-2 hover:bg-secondary cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="relative">
          {/* {conversation.unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
              {conversation.unread}
            </span>
          )} */}

          <div className="flex-center bg-primary text-accent rounded-full p-1 mr-2">
            <span className="text-lg font-semibold">{conversation.id}</span>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-xs text-right">
            {formatDistance(conversation.updatedAt, new Date(), {
              addSuffix: true,
            })}
          </p>
          <p className="font-semibold">{conversation.id}</p>
        </div>
      </div>
      <div className=" flex flex-col">
        <span className=" text-muted-foreground text-sm truncate overflow-hidden">
          {conversation.userId}
        </span>
        {/*<span>{conversation.updatedAt.toString()}</span> */}
      </div>
    </Link>
  );
};
