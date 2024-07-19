"use client";

import { useContext, useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import SocketContext from "@/providers/socket";
import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import { ChatCard } from "./card";
import { ChatUsersList } from "./list";
import { chatInsert } from "@/actions/chat";
import { useChatData } from "@/hooks/use-chat";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ChatsClient = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { fullChats, fullChatsIsFetching } = useChatData("empty");

  const onSelectUser = (e: string) => {
    chatInsert(e).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      router.push(`/chat/${data.success?.id}`);
    });
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col justify-start min-h-[60%] max-h-[75%] w-[400px]">
          <h3 className="text-2xl font-semibold py-2">New chat</h3>
          <ChatUsersList onSelectUser={onSelectUser} />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col h-full w-[250px] gap-1 p-1">
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
