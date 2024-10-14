import React from "react";
import { cn } from "@/lib/utils";
import { Clock, MoreVertical, Phone, UserIcon } from "lucide-react";
import { useChatStore } from "@/hooks/use-chat";
import { useLoginStatus } from "@/hooks/use-login-status";

import { OnlineUser } from "@/types/user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { formatSecondsToTime } from "@/formulas/numbers";
import { chatInsert } from "@/actions/chat";

const ChatCard = ({ user }: { user: OnlineUser }) => {
  const { onChatInfoOpen, user: agent } = useChatStore();
  const { onLoginStatusOpen } = useLoginStatus();
  const onChatClick = async () => {
    const chat = await chatInsert(user.id);
    onChatInfoOpen(user, chat.success?.id);
  };
  return (
    <div
      className={cn(
        "group relative border border-[#ccc] rounded  p-2 cursor-pointer w-full my-1",
        agent?.id == user.id ? "bg-primary/25" : "hover:bg-secondary"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0"
          >
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={() => onLoginStatusOpen(user)}
          >
            Logins
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div onClick={onChatClick}>
        <div className="flex items-center">
          <div className="relative">
            <Badge
              className="p-1 absolute bottom-0 right-0 z-10"
              variant={user.online ? "success" : "destructive"}
            ></Badge>
            <Avatar>
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-primary dark:bg-accent">
                <UserIcon className="text-accent dark:text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 px-2 text-center">
            <p className="text-lg font-bold capitalize">{user.userName}</p>
            <p className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 opacity-0 group-hover:opacity-100">
          <span className=" lowercase text-sm font-semibold">
            {user.role.replace("_", " ")}
          </span>
          <div className="flex justify-end items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <Phone size={14} />
              <p className="text-muted-foreground text-xs font-bold">
                {user.calls}
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <Clock size={14} />
              <p className="text-muted-foreground text-xs font-bold">
                {formatSecondsToTime(user.duration)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
