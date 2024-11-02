"use client";
import { useChatOnlineActions, useChatStore } from "@/hooks/use-chat";

import ChatCard from "./card";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { EmptyCard } from "../reusable/empty-card";

export const ChatList = () => {
  const { allUsers: onlineUsers, showOnline } = useChatStore();
  const { onChatSettingsOnlineToggleMutate, chatSettingsOnlineToggling } =
    useChatOnlineActions();
  const [users, setUsers] = useState(onlineUsers);

  useEffect(() => {
    const filterdUsers = showOnline
      ? onlineUsers.filter((e) => e.online == true)
      : onlineUsers;
    setUsers(filterdUsers);
  }, [showOnline, onlineUsers]);

  return (
    <div className="flex-1 flex flex-col h-full gap-2 overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Show only online agents</p>

        <Switch
          name="cblShowOnline"
          checked={showOnline}
          disabled={chatSettingsOnlineToggling}
          onCheckedChange={() => onChatSettingsOnlineToggleMutate(!showOnline)}
        />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <ScrollArea>
          {users?.map((user) => (
            <ChatCard key={user.id} user={user} />
          ))}
          {!users.length && <EmptyCard title="No agents online" />}
        </ScrollArea>
      </div>
    </div>
  );
};
