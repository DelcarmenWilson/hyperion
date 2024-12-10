"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useChatStore } from "@/stores/chat-store";
import { useChatData, useChatActions } from "@/hooks/chat/use-chat";

import { Button } from "@/components/ui/button";
import { ChatCard } from "./card";
import { CustomDialog } from "@/components/global/custom-dialog";
import { ChatUsersList } from "./list";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

const ChatsSidebar = () => {
  const user = useCurrentUser();
  const { onFullChatsGet } = useChatData();
  const { fullChats, fullChatsFetching, fullChatsLoading } = onFullChatsGet();
  const { chatId, setChatId } = useChatStore();
  const { onChatInsert, chatInserting } = useChatActions();

  const [dialogOpen, setDialogOpen] = useState(false);
  //TODO - see if we can also add this to the useChatActionsHook
  const onSelectUser = (userId: string) => {
    onChatInsert(userId);
    setDialogOpen(false);
  };

  return (
    <>
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="New chat"
        description="Agent Chats Form"
      >
        <ChatUsersList onSelectUser={onSelectUser} loading={chatInserting} />
      </CustomDialog>

      <div className="flex flex-col h-full gap-1 p-1">
        <div className="flex justify-between items-center">
          <h4 className="text-lg text-muted-foreground font-semibold">Chats</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
          >
            <Plus size={16} />
          </Button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto h-full">
          {fullChats?.map((chat) => {
            const { firstName, lastName, image } =
              chat.userOneId == user?.id! ? chat.userTwo : chat.userOne;
            return (
              <SkeletonWrapper key={chat.id} isLoading={fullChatsLoading}>
                <ChatCard
                  id={chat.id}
                  body={chat.lastMessage?.body}
                  firstName={firstName}
                  lastName={lastName}
                  image={image}
                  lastDate={chat.updatedAt}
                  setId={setChatId}
                  active={chatId == chat.id}
                />
              </SkeletonWrapper>
            );
          })}
          {!fullChats && !fullChatsFetching && <EmptyCard title="No Chats" />}
        </div>
      </div>
    </>
  );
};
export default ChatsSidebar;
