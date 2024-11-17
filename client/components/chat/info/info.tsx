"use client";
import { ArrowRight, Trash, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatActions, useChatStore } from "@/hooks/chat/use-chat";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ChatForm from "./form";
import DeleteDialog from "@/components/custom/delete-dialog";
import Hint from "@/components/custom/hint";
import { MessageList } from "./message-list";

const ChatInfo = () => {
  const { onChatInfoClose, user } = useChatStore();
  const { onChatDelete, chatDeleting } = useChatActions();
  return (
    <div className="flex gap-2 flex-col w-[500px] h-full p-4">
      <div className="flex gap-2 items-center border-b p-2 group">
        <Avatar
          className={cn(
            "border-2 border-transparent p-[1px]",
            user?.online && "border-primary"
          )}
        >
          <AvatarImage className="rounded-full" src={user?.image || ""} />
          <AvatarFallback className="bg-primary dark:bg-accent">
            <UserIcon className="text-accent dark:text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex justify-between items-center">
          <p>
            <span className="text-lg font-bold">{user?.userName}</span>
            {/* <span className="lowercase"> ({chatId})</span> */}
          </p>
          <div className="opacity-0 group-hover:opacity-100">
            <Hint label="Delete Chat">
              <DeleteDialog
                title="chat"
                cfText="Delete Chat"
                onConfirm={onChatDelete}
                loading={chatDeleting}
              />
            </Hint>
          </div>
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
  );
};

export default ChatInfo;
