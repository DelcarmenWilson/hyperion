import { useContext, useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeadData, useLeadStore } from "@/hooks/lead/use-lead";
import {
  useLeadMessageActions,
  useLeadMessageData,
} from "@/hooks/lead/use-message";

import { Button } from "@/components/ui/button";
import { MessageCard } from "./message-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { LeadMessage } from "@prisma/client";
import { FullMessage } from "@/types";
import axios from "axios";

export const SmsBody = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();
  const { leadBasic } = useLeadData();

  const { messages: initMessages, isFetchingMessages } = useLeadMessageData();
  const { conversationId, setConversationId } = useLeadStore();
  const { IsPendinginitialMessage, onMessageInitialSubmit } =
    useLeadMessageActions();

  const [messages, setMessages] = useState(initMessages);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  //TODO - messages are not scrolling to the bottom after being inserted
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView(true);
  };
  const onSetMessage = (newMessage: LeadMessage) => {
    const existing = messages?.find((e) => e.id == newMessage.id);
    if (existing != undefined) return;
    if (!conversationId) {
      setConversationId(newMessage.conversationId);
    }
    setMessages((messages) => [...messages!, newMessage]);
    scrollToBottom();
  };

  useEffect(() => {
    if (conversationId) {
      axios.post(`/api/conversations/${conversationId}/seen`);
      userEmitter.emit("conversationSeen", conversationId as string);
    }
    scrollToBottom();
    userEmitter.on("messageInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.off("messageInserted", (info) => onSetMessage(info));
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const messageHandler = (message: LeadMessage) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      onSetMessage(message);
    };
    socket?.on("conversation-messages-new", (data: { dt: FullMessage[] }) => {
      data.dt.forEach((message) => messageHandler(message));
    });
    return () => {
      socket?.off(
        "conversation-messages-new",
        (data: { dt: FullMessage[] }) => {
          data.dt.forEach((message) => messageHandler(message));
        }
      );
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!initMessages) return;
    setMessages(initMessages);
    setTimeout(() => {
      scrollToBottom();
    }, 2000);
  }, [initMessages]);

  return (
    <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4">
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col h-full w-full"
      >
        <SkeletonWrapper isLoading={isFetchingMessages} fullHeight>
          {!messages?.length && (
            <div className="flex-center flex-col text-muted-foreground h-full gap-2">
              <p className="font-bold">No sms have been sent</p>
              <Button
                className="gap-2"
                disabled={IsPendinginitialMessage}
                variant="outlineprimary"
                onClick={onMessageInitialSubmit}
              >
                <MessageSquare size={16} />
                Send an initial message
              </Button>
              <p>- OR -</p>
              <p className="mt-2"> Type a message below</p>
            </div>
          )}
          {messages?.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              username={
                message.role === "user" ? leadBasic?.firstName! : user?.name!
              }
            />
          ))}
          <div ref={bottomRef} className="pt-2" />
        </SkeletonWrapper>
      </div>
    </ScrollArea>
  );
  // return (
  //   <ScrollArea className="w-full h-full px-5">
  //     <div
  //       ref={chatContainerRef}
  //       className="flex flex-1 flex-col h-full w-full"
  //     >
  //       <SkeletonWrapper isLoading={isFetchingMessages} fullHeight>
  //         {!messages?.length ? (
  //           <div className="flex-center flex-col text-muted-foreground h-full gap-2">
  //             <p className="font-bold">No sms have been sent</p>
  //             <Button
  //               className="gap-2"
  //               disabled={IsPendinginitialMessage}
  //               variant="outlineprimary"
  //               onClick={onMessageInitialSubmit}
  //             >
  //               <MessageSquare size={16} />
  //               Send an initial message
  //             </Button>
  //             <p>- OR -</p>
  //             <p className="mt-2"> Type a message below</p>
  //           </div>
  //         ) : (
  //           <>
  //             {messages?.map((message) => (
  //               <MessageCard
  //                 key={message.id}
  //                 message={message}
  //                 username={
  //                   message.role === "user"
  //                     ? leadBasic?.firstName!
  //                     : user?.name!
  //                 }
  //               />
  //             ))}
  //           </>
  //           // </ScrollArea>
  //         )}
  //       </SkeletonWrapper>
  //     </div>
  //   </ScrollArea>
  // );
};
