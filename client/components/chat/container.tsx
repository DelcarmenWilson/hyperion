"use client";
import { useChatStore } from "@/hooks/use-chat";

import { ChatInfo } from "./info";
import { ChatList } from "./list";
import { ChatMenu } from "./menu";
import { DrawerExtendedSm } from "@/components/custom/drawer/extended-sm";
import { GroupDialog } from "./group-dialog";

export const ChatContainer = () => {
  const { isChatOpen, onChatClose } = useChatStore();
  return (
    <>
      <GroupDialog />
      <DrawerExtendedSm
        title="Agents"
        menu={<ChatMenu />}
        isOpen={isChatOpen}
        onClose={onChatClose}
        sideDrawer={<ChatInfo />}
        scroll={false}
        size="w-auto"
      >
        <ChatList />
      </DrawerExtendedSm>
    </>
  );
};
