"use client";
import { useEffect, useRef, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBox } from "@/components/reusable/message-box";
import { FullMessageType } from "@/types";
import useConversation from "@/hooks/user-conversation";
import axios from "axios";

interface BodyProps {
  initialMessages: FullMessageType[];
  leadLastName: string;
}
export const Body = ({ initialMessages, leadLastName }: BodyProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <ScrollArea className="relative flex-1 p-2 pr-10 w-full">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
          username={message.role === "user" ? leadLastName : "assistant"}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </ScrollArea>
  );
};
