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
import { ChatUsersList } from "./form";
import { chatInsert } from "@/actions/chat";
import { chatGetById } from "@/data/chat";
import { FullChatMessage, ShortChat } from "@/types";

type ChatsClientProps = {
  initChats: ShortChat[];
};
export const ChatsClient = ({ initChats }: ChatsClientProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const router = useRouter();
  const [chats, setChats] = useState<ShortChat[]>(initChats);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSetChats = (message: FullChatMessage) => {
    setChats((current) => {
      const convo = current.find((e) => e.id == message.chatId);
      if (convo) {
        const index = current.findIndex((e) => e.id == message.chatId);
        if (!convo || index == -1) {
          return current;
        }
        convo.lastMessage = message.content;
        convo.updatedAt = message.updatedAt;
        current.unshift(current.splice(index, 1)[0]);

        return [...current];
      }

      chatGetById(message.chatId).then((data) => {
        if (data) return [data, ...current];
        else return [...current];
      });
      return [...current];
    });
  };

  const onSelectUser = (e: string) => {
    chatInsert(e).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      router.push(`/chat/${data.success?.id}`);
    });
  };

  useEffect(() => {
    socket?.on("chat-message-received", (message: FullChatMessage) => {
      onSetChats(message);
    });
    userEmitter.on("chatMessageInserted", (info) => {
      onSetChats(info);
    });
    return () => {
      userEmitter.off("chatMessageInserted", (info) => onSetChats(info));
    };
  }, []);
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
          {chats.length > 0 ? (
            <>
              {chats.map((chat) => (
                <ChatCard key={chat.id} chat={chat} />
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
