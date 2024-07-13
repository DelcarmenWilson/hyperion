import React from "react";
import { Clock, Phone, UserIcon } from "lucide-react";
import { OnlineUser } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { useChat } from "@/hooks/use-chat";
import { formatSecondsToTime } from "@/formulas/numbers";

const ChatCard = ({ user }: { user: OnlineUser }) => {
  const { onChatInfoOpen } = useChat();
  return (
    <div
      className="border rounded hover:bg-secondary p-2 cursor-pointer w-full my-1"
      onClick={() => onChatInfoOpen(user)}
    >
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
          <p>
            <span className="text-lg font-bold">{user.userName}</span>
            {user.role != "USER" && (
              <span className=" lowercase"> ({user.role})</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex justify-center items-center gap-2">
          <Phone size={16} />
          {user.calls}
        </div>
        <div className="flex justify-center items-center gap-2">
          <Clock size={16} />
          {formatSecondsToTime(user.time)}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
