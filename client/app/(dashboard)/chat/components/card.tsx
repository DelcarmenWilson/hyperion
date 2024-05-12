"use client";
import { ShortChat } from "@/types";
import { differenceInDays, format, formatDistance, subDays } from "date-fns";
import Link from "next/link";
import React from "react";
type ChatCardProps = {
  chat: ShortChat;
};
export const ChatCard = ({ chat }: ChatCardProps) => {
  return (
    <Link
      href={`/chats/${chat.id}`}
      className="flex flex-col border rounded-xl overflow-hidden p-2 hover:bg-secondary cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="relative">
          {/* {chat.unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
              {chat.unread}
            </span>
          )} */}

          <div className="flex-center bg-primary text-accent rounded-full p-1 mr-2">
            <span className="text-lg font-semibold">{chat.name}</span>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-xs text-right">
            {formatDistance(chat.updatedAt, new Date(), {
              addSuffix: true,
            })}
          </p>
          <p className="font-semibold">{chat.name}</p>
        </div>
      </div>
      <div className=" flex flex-col">
        <span className=" text-muted-foreground text-sm truncate overflow-hidden">
          {chat.lastMessage}
        </span>
        {/*<span>{chat.updatedAt.toString()}</span> */}
      </div>
    </Link>
  );
};
