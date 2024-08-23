import { useContext, useEffect, useRef, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { GptMessage } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCard } from "./message-card";

type Props = {
  initMessages?: GptMessage[];
};

export const GptConversationBody = ({ initMessages }: Props) => {
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

  const onSetMessage = (newMessages: GptMessage[]) => {
    setMessages((messages) => [...messages!, ...newMessages]);
    ScrollDown();
  };

  useEffect(() => {
    ScrollDown();
    userEmitter.on("gptMessageInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.off("gptMessageInserted", (info) => onSetMessage(info));
    };
    // eslint-disable-next-line
  }, []);

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
