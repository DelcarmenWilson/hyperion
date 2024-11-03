"use client";
import { ArrowRight, Trash, UserIcon } from "lucide-react";
import { useChatActions, useChatStore } from "@/hooks/use-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageList } from "./message-list";
import { ChatForm } from "./form";
import { hideDeletedMessages } from "@/actions/chat/message";


export const ChatInfo = () => {
  const onHideDeleted=()=>{const result= hideDeletedMessages()}
  const { onChatInfoClose, user, chatId } = useChatStore();
const{onChatDelete}=useChatActions();
  return (
    <div className="flex gap-2 flex-col w-[500px] h-full p-4">
      <div className="flex gap-2 items-center border-b p-2">
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

        <p>
          <span className="text-lg font-bold">{user?.userName}</span>
          {/* <span className="lowercase"> ({chatId})</span> */}
        </p>
        
        <Button size="sm" className="ml-auto" onClick={()=>onChatDelete(chatId!)}>
          <span className="sr-only">Delete Entire Chat</span>
          <Trash size={16} />
        </Button>

        <Button size="sm" className="ml-auto" onClick={onHideDeleted}>
         Hide deleted
        </Button>

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
