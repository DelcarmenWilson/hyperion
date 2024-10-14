"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useChatStore, useChatData } from "@/hooks/use-chat";

import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import { ChatCard } from "./card";
import { CustomDialog } from "@/components/global/custom-dialog";
import { ChatUsersList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { chatInsert } from "@/actions/chat";

export const ChatsClient = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { fullChats, fullChatsIsFetching } = useChatData("empty");
  const { setChatId } = useChatStore();
  const onSelectUser = (e: string) => {
    chatInsert(e).then((data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setChatId(data.success?.id);
      setDialogOpen(false);
    });
  };

  return (
    <>
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="New chat"
        description="Agent Chats Form"
      >
        <ChatUsersList onSelectUser={onSelectUser} />
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
          {fullChats?.length ? (
            <>
              {fullChats?.map((chat) => (
                <SkeletonWrapper key={chat.id} isLoading={fullChatsIsFetching}>
                  <ChatCard chat={chat} />
                </SkeletonWrapper>
              ))}
            </>
          ) : (
            <EmptyCard title="No Chats" />
          )}
        </div>
      </div>
    </>
  );
};
