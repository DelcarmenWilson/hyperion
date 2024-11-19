"use client";
import React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Renderer from "@/components/global/message/renderer";
import { formatDistance } from "date-fns";
//TODO- not sure if we need to import this dynamically. some more testing is needed
// const Renderer = dynamic(() => import("@/components/global/message/renderer"), {
//   ssr: false,
// });
type Props = {
  id: string;
  body: string | null | undefined;
  firstName: string;
  lastName: string;
  image: string | null;
  lastDate: Date;
  setId?: (e: string) => void;
  active?: boolean;
};
export const ChatCard = ({
  id,
  body,
  firstName,
  lastName,
  image,
  lastDate,
  setId,
  active = false,
}: Props) => {
  const initials = `${firstName.charAt(0)} ${lastName.charAt(0)}`;

  return (
    <div
      className={cn(
        "relative flex items-center gap-2 border rounded hover:bg-secondary  p-2 cursor-pointer w-full",
        active && "bg-primary/25"
      )}
      onClick={() => {
        if (setId) setId(id);
      }}
    >
      <div className="relative">
        {/* {chat.unread > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-accent rounded-full text-sm p-1">
              {chat.unread}
            </span>
          )} */}

        <Avatar className="rounded-full">
          <AvatarImage className="rounded-full" src={image as string} />
          <AvatarFallback className="rounded-full bg-primary/50 text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm">{firstName}</p>
          <p className="text-xs text-right">
            {formatDistance(lastDate, new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/* <div className="text-muted-foreground w-full text-sm truncate overflow-hidden"> */}
        <div className="text-sm text-muted-foreground w-full text-ellipsis line-clamp-1">
          {body ? <Renderer value={body} /> : <span>new message</span>}
        </div>
      </div>
    </div>
  );
};
