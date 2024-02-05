"use client";
import { useEffect, useRef, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBox } from "@/components/reusable/message-box";
import { FullConversationType, FullMessageType } from "@/types";
import useConversation from "@/hooks/user-conversation";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface BodyProps {
  initialData: FullConversationType;
}
export const Body = ({ initialData }: BodyProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState(initialData.messages);
  const { conversationId } = useConversation();

  const leadName = initialData.lead.lastName as string;

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId as string);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      if (message.role == "user" && audioRef.current) {
        audioRef.current.play();
      }
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };
    pusherClient.bind("messages:new", messageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId as string);
      pusherClient.unbind("messages:new", messageHandler);
    };
  }, [conversationId]);

  return (
    // <ScrollArea className="flex-1 flex flex-col p-2 pr-3">

    <div className="flex flex-col flex-1 w-full px-4 overflow-hidden overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message!}
          username={message.role === "user" ? leadName : "assistant"}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
      <audio ref={audioRef} src="/sounds/message.mp3" />
    </div>
    // </ScrollArea>
  );
};
