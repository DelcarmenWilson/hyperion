"use client";
import React from "react";
import { DrawerRight } from "@/components/custom/drawer-right";
import { ChatList } from "./list";
import { useChat } from "@/hooks/use-chat";
import { ChatInfo } from "./info";

export const ChatDrawer = () => {
  const { isChatOpen, onChatClose } = useChat();
  return (
    <DrawerRight
      title="Agents"
      isOpen={isChatOpen}
      onClose={onChatClose}
      scroll={false}
      size="w-auto"
    >
      {/* <ChatList /> */}
      <div className="flex flex-1 border-t h-full overflow-hidden">
        <ChatInfo />

        <ChatList />
      </div>
    </DrawerRight>
  );
};
