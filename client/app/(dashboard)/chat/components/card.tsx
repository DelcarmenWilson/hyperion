"use client";
import React from "react";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { ShortChat } from "@/types";
import { useCurrentUser } from "@/hooks/use-current-user";

type ChatCardProps = {
  chat: ShortChat;
};
export const ChatCard = ({ chat }: ChatCardProps) => {
  const user = useCurrentUser();
  const otherUser = chat.userOneId == user?.id! ? chat.userTwo : chat.userOne;
  const initials = `${otherUser.firstName.substring(
    0,
    1
  )} ${otherUser.lastName.substring(0, 1)}`;
  const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
  return (
    <Link
      href={`/chat/${chat.id}`}
      className="flex flex-col border rounded-xl overflow-hidden p-2 hover:bg-secondary cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="relative">
          {/* {chat.unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
              {chat.unread}
            </span>
          )} */}

          <div className="flex-center  h-10 w-10 text-lg font-bold bg-primary text-accent rounded-full">
            {initials}
          </div>
        </div>
        <div className="text-sm">
          <p className="text-xs text-right">
            {formatDistance(chat.updatedAt, new Date(), {
              addSuffix: true,
            })}
          </p>
          <p className="font-semibold">{fullName}</p>
        </div>
      </div>
      <div className=" flex flex-col">
        <span className=" text-muted-foreground text-sm truncate overflow-hidden">
          {chat.lastMessage || "new message"}
        </span>
        {/*<span>{chat.updatedAt.toString()}</span> */}
      </div>
    </Link>
  );
};
