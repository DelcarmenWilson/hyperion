import { ScrollArea } from "@/components/ui/scroll-area";
import { userEmitter } from "@/lib/event-emmiter";
import { Message } from "@prisma/client";
import { MessageCard } from "./message-card";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

type SmsBodyProps = {
  initConversationId?: string;
  initMessages?: Message[];
  leadName: string;
  userName: string;
};

export const SmsBody = ({
  initConversationId,
  initMessages,
  leadName,
  userName,
}: SmsBodyProps) => {
  const [conversationId, setConversationId] = useState(initConversationId);
  const [messages, setMessages] = useState(initMessages);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };

  const onSetMessage = (newMessage: Message) => {
    if (!conversationId) {
      setConversationId(newMessage.conversationId);
    }
    const existing = messages?.find((e) => e.id == newMessage.id);
    if (existing == undefined)
      setMessages((messages) => [...messages!, newMessage]);
    ScrollDown();
  };

  useEffect(() => {
    ScrollDown();
    userEmitter.on("messageInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.on("messageInserted", (info) => onSetMessage(info));
    };
  }, [initMessages, messages]);

  useEffect(() => {
    if (conversationId) {
      pusherClient.subscribe(conversationId as string);
      axios.post(`/api/conversations/${conversationId}/seen`);
      userEmitter.emit("conversationSeen", conversationId as string);
    }

    const messageHandler = (message: Message) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      if (message.role == "user" && audioRef.current) {
        audioRef.current.play();
      }
      onSetMessage(message);
    };
    pusherClient.bind("messages:new", messageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId as string);
      pusherClient.unbind("messages:new", messageHandler);
    };
  }, [conversationId]);

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
      <audio ref={audioRef} src="/sounds/message.mp3" />
    </ScrollArea>
  );
};
