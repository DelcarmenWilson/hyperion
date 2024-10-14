"use client";
import { useChatStore } from "@/hooks/use-chat";

import ChatCard from "./card";
import { ScrollArea } from "../ui/scroll-area";

export const ChatList = () => {
  const { onlineUsers } = useChatStore();
  return (
    <ScrollArea>
      {onlineUsers?.map((user) => (
        <ChatCard key={user.id} user={user} />
      ))}
    </ScrollArea>
  );
};
