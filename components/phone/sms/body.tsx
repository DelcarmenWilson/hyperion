import { ScrollArea } from "@/components/ui/scroll-area";
import { emitter } from "@/lib/event-emmiter";
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
  console.log(initMessages, leadName, userName);
  const bottomRef = useRef<HTMLDivElement>(null);
  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };
  useEffect(() => {
    ScrollDown();

    const onSetsetMessages = (newMessage: Message) => {
      const existing = messages?.find((e) => e.id == newMessage.id);
      if (existing == undefined)
        setMessages((messages) => [...messages!, newMessage]);
      ScrollDown();
    };
    emitter.on("messageInserted", (info) => onSetsetMessages(info));
    return () => {
      emitter.on("messageInserted", (info) => onSetsetMessages(info));
    };
  }, [initMessages]);
  return (
    // <div className="flex flex-col flex-1 w-full px-4 overflow-hidden overflow-y-auto">
    <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4">
      {!messages?.length && (
        <p className="text-center text-muted-foreground">
          No sms have been sent
        </p>
      )}
      {messages?.map((message) => (
        <MessageCard
          key={message.id}
          data={message}
          username={message.role === "user" ? leadName : userName}
        />
      ))}
      <div ref={bottomRef} className="pt-2" />
    </ScrollArea>
    // </div>
  );
};
