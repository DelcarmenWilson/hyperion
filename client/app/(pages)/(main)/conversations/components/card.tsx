"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatDistance } from "date-fns";

type Props = {
  id: string;
  body: string | null | undefined;
  firstName: string;
  lastName: string;
  unread: number;
  lastDate: Date;
  active: boolean;
};
export const ConversationCard = ({
  id,
  body,
  firstName,
  lastName,
  unread,
  lastDate,
  active = false,
}: Props) => {
  const initials = `${firstName.charAt(0)} ${lastName.charAt(0)}`;
  const fullName = `${firstName} ${lastName}`;
  return (
    <Link
      href={`/conversations/${id}`}
      className={cn(
        "relative flex items-center gap-2 border rounded hover:bg-secondary p-2 cursor-pointer w-full",
        active && "bg-primary/25"
      )}
    >
      <div className="relative">
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
            {unread}
          </span>
        )}

        <Avatar className="rounded-full">
          <AvatarImage className="rounded-full" src={""} />
          <AvatarFallback className="rounded-full bg-primary/50 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm">{fullName}</p>
          <p className="text-xs text-right">
            {formatDistance(lastDate, new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/* <div className="text-muted-foreground w-full text-sm truncate overflow-hidden"> */}
        <div className="text-sm text-muted-foreground w-full text-ellipsis line-clamp-1">
          <span>{body}</span>
        </div>
      </div>
    </Link>
  );
};
