import { useContext, useEffect, useRef, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { GptMessage } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCard } from "./message-card";

type GptConversationBodyProps = {
  conversationId: string;
  initMessages?: GptMessage[];
};

export const GptConversationBody = ({
  conversationId,
  initMessages,
}: GptConversationBodyProps) => {
  const [messages, setMessages] = useState(initMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  //TODO - messages are not scrolling to the bottom after being inserted
  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };

  // const onSetMessage = (newMessage: Message) => {
  //   const existing = messages?.find((e) => e.id == newMessage.id);
  //   if (existing != undefined) return;
  //   if (!conversationId) {
  //     setConversationId(newMessage.conversationId);
  //   }
  //   setMessages((messages) => [...messages!, newMessage]);
  //   ScrollDown();
  // };

  // useEffect(() => {
  //   if (conversationId) {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //     userEmitter.emit("conversationSeen", conversationId as string);
  //   }
  //   ScrollDown();
  //   userEmitter.on("messageInserted", (info) => onSetMessage(info));
  //   return () => {
  //     userEmitter.off("messageInserted", (info) => onSetMessage(info));
  //   };
  //   // eslint-disable-next-line
  // }, []);

  return (
    <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4">
      {!messages?.length && (
        <p className="text-center text-muted-foreground">
          No sms have been sent
        </p>
      )}
      {messages?.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          username={message.role}
        />
      ))}
      <div ref={bottomRef} className="pt-2" />
    </ScrollArea>
  );
};
