import { formatTime } from "@/formulas/dates";
import { cn } from "@/lib/utils";
import React from "react";
type MessageCardProps = {
  username: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
};

export const MessageCard = ({
  username,
  content,
  createdAt,
  isOwn,
}: MessageCardProps) => {
  return (
    <div className={cn("flex flex-col w-full", isOwn && "items-end")}>
      <div
        className={cn(
          "border bg-secondary text-black max-w-[70%] text-wrap break-words rounded-md p-1 w-fit",
          isOwn && "bg-primary text-white"
        )}
      >
        <p>{content}</p>
      </div>

      <p className="text-sm">
        <b>{username}</b> {formatTime(createdAt)}
      </p>
    </div>
  );
};
