"use client";
import React from "react";
import Link from "next/link";
import { ShortConversation } from "@/types";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  conversation: ShortConversation;
  active: boolean;
};
export const ConversationCard = ({ conversation, active }: Props) => {
  const initials = `${conversation.firstName.substring(
    0,
    1
  )} ${conversation.lastName.substring(0, 1)}`;
  const fullName = `${conversation.firstName} ${conversation.lastName}`;
  return (
    <Link
      href={`/conversations/${conversation.id}`}
      className={cn(
        "flex flex-col border rounded-xl overflow-hidden p-2 hover:bg-secondary cursor-pointer",
        active && "bg-secondary"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="relative">
          {conversation.unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
              {conversation.unread}
            </span>
          )}

          <div className="flex-center bg-primary text-accent rounded-full p-1 mr-2">
            <span className="text-lg font-semibold">{initials}</span>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-xs text-right">
            {formatDistance(conversation.updatedAt, new Date(), {
              addSuffix: true,
            })}
          </p>
          <p className="font-semibold">{fullName}</p>
        </div>
      </div>
      <div className=" flex flex-col">
        <span className=" text-muted-foreground text-sm truncate overflow-hidden">
          {conversation.message}
        </span>
        {/*<span>{conversation.updatedAt.toString()}</span> */}
      </div>
    </Link>
  );
};
