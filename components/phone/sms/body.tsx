import { ScrollArea } from "@/components/ui/scroll-area";
import { userEmitter } from "@/lib/event-emmiter";
import { Message } from "@prisma/client";
import { MessageCard } from "./message-card";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useRef, useState } from "react";

type SmsBodyProps = {
  initMessages?: Message[];
  leadName: string;
  userName: string;
};

export const SmsBody = ({ initMessages, leadName, userName }: SmsBodyProps) => {
  const [messages, setMessages] = useState(initMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ScrollDown = () => {
      if (bottomRef.current) {
        const parent = bottomRef.current.parentElement?.parentElement;
        const top = bottomRef.current.offsetTop;
        parent?.scrollTo({ top, behavior: "smooth" });
      }
    };

    const onSetMessage = (newMessage: Message) => {
      const existing = messages?.find((e) => e.id == newMessage.id);
      if (existing == undefined)
        setMessages((messages) => [...messages!, newMessage]);
      ScrollDown();
    };

    ScrollDown();
    userEmitter.on("messageInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.on("messageInserted", (info) => onSetMessage(info));
    };
  }, [initMessages, messages]);
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
          username={message.role === "user" ? leadName : userName}
        />
      ))}
      <div ref={bottomRef} className="pt-2" />
    </ScrollArea>
  );
};
