"use client";
import { ArrowRight, Trash, UserIcon } from "lucide-react";
import { useChatActions, useChatStore } from "@/hooks/chat/use-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageList } from "./message-list";
import { ChatForm } from "./form";
import Hint from "../custom/hint";
import { AlertModal } from "../modals/alert";
import { useState } from "react";

export const ChatInfo = () => {
  const { onChatInfoClose, user, chatId } = useChatStore();
  const { onChatDelete, chatDeleting } = useChatActions();
  const [alertOpen, setAlertOpen] = useState(false);
  const onHandleChatDelete = () => {
    onChatDelete();
    setAlertOpen(false);
  };
  return (
    <>
      <AlertModal
        title="Want to delete this chat"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onHandleChatDelete}
        loading={chatDeleting}
        height="h-200"
      />
      <div className="flex gap-2 flex-col w-[500px] h-full p-4">
        <div className="flex gap-2 items-center border-b p-2 group">
          {/* {JSON.stringify(user)} */}
          <div className="relative">
            <Badge
              className="p-[0.3rem] absolute bottom-0 right-0 z-10"
              variant={user?.online ? "success" : "destructive"}
            ></Badge>
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-primary dark:bg-accent">
                <UserIcon className="text-accent dark:text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 flex justify-between items-center">
            <p>
              <span className="text-lg font-bold">{user?.userName}</span>
              {/* <span className="lowercase"> ({chatId})</span> */}
            </p>
            <Hint label="Delete Chat">
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => setAlertOpen(true)}
              >
                <span className="sr-only">Delete Entire Chat</span>
                <Trash size={16} />
              </Button>
            </Hint>
          </div>

          <Button size="sm" className="ml-auto" onClick={onChatInfoClose}>
            <span className="sr-only">Close panel</span>
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* MESSAGELIST */}
        <MessageList />

        {/* FORM */}
        <ChatForm placeholder="Your message...." />
      </div>
    </>
  );
};
