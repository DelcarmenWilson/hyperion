"use client";
import { useChatStore } from "@/hooks/chat/use-chat";

import ChatInfo from "./info/info";
import ChatUserList from "./user/list";
import ChatMenu from "./menu";
import { DrawerExtendedSm } from "@/components/custom/drawer/extended-sm";
import GroupDialog from "./group-dialog";

export const ChatContainer = () => {
  const { isChatOpen, onChatClose, isChatInfoOpen } = useChatStore();
  return (
    <>
      <GroupDialog />
      <DrawerExtendedSm
        title="Agents"
        menu={<ChatMenu />}
        isOpen={isChatOpen}
        onClose={onChatClose}
        sideDrawer={<ChatInfo />}
        sideDrawerOpen={isChatInfoOpen}
        scroll={false}
        size="w-auto"
      >
        <ChatUserList />
      </DrawerExtendedSm>
    </>
  );
};
