import { useContext, useEffect, useRef, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { ChatbotMessage } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCard } from "./message-card";

type Props = {
  initMessages?: ChatbotMessage[];
};

export const ChatbotConversationBody = ({ initMessages }: Props) => {
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

  const onSetMessage = (newMessages: ChatbotMessage[]) => {
    setMessages((messages) => [...messages!, ...newMessages]);
    ScrollDown();
  };

  useEffect(() => {
    ScrollDown();
    userEmitter.on("chatbotMessageInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.off("chatbotMessageInserted", (info) => onSetMessage(info));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4">
      {!messages?.length && (
        <div className="flex-center w-full h-full">
          <p className="text-muted-foreground">Go ahead! Ask me anything</p>
        </div>
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
