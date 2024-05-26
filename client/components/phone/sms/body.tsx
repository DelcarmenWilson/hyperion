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
  const bottomRef = useRef<HTMLDivElement>(null);

  //TODO - messages are not scrolling to the bottom after being inserted
  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };

  const onSetMessage = (newMessage: Message) => {
    const existing = messages?.find((e) => e.id == newMessage.id);
    if (existing != undefined) return;
    if (!conversationId) {
      setConversationId(newMessage.conversationId);
    }
    setMessages((messages) => [...messages!, newMessage]);
    ScrollDown();
  };

  const onSetMessages = (newMessages: Message[]) => {
    const existing = messages?.find((e) => e.id == newMessages[0].id);
    if (existing != undefined) return;
    if (!conversationId) {
      setConversationId(newMessages[0].conversationId);
    }
    setMessages((messages) => [...messages!, ...newMessages]);
    ScrollDown();
  };

  useEffect(() => {
    ScrollDown();
    userEmitter.on("messageInserted", (info) => onSetMessage(info));
    return () => {
      userEmitter.off("messageInserted", (info) => onSetMessage(info));
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (conversationId) {
      pusherClient.subscribe(conversationId as string);
      axios.post(`/api/conversations/${conversationId}/seen`);
      userEmitter.emit("conversationSeen", conversationId as string);
    }

    const messagesHandler = (messages: Message[]) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      onSetMessages(messages);
    };
    const messageHandler = (message: Message) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      onSetMessage(message);
    };
    pusherClient.bind("messages:new", messagesHandler);
    pusherClient.bind("message:new", messageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId as string);
      pusherClient.unbind("messages:new", messagesHandler);
      pusherClient.unbind("message:new", messageHandler);
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
    </ScrollArea>
  );
};
