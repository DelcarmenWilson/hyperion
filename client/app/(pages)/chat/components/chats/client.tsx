"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useChatData, useChatActions } from "@/hooks/use-chat";

import { Button } from "@/components/ui/button";
import { ChatCard } from "./card";
import { CustomDialog } from "@/components/global/custom-dialog";
import { ChatUsersList } from "./list";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ChatsClient = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { onFullChatsGet } = useChatData();
  const { fullChats, fullChatsFetching, fullChatsLoading } = onFullChatsGet();
  const { onChatInsert, chatInserting } = useChatActions();

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
          {fullChats?.map((chat) => (
            <SkeletonWrapper key={chat.id} isLoading={fullChatsLoading}>
              <ChatCard chat={chat} />
            </SkeletonWrapper>
          ))}
          {!fullChats && !fullChatsFetching && <EmptyCard title="No Chats" />}
        </div>
      </div>
    </>
  );
};
