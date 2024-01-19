"use client";
import { useEffect, useRef, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBox } from "@/components/reusable/messageBox";
import { FullConversationType } from "@/types";
import useConversation from "@/hooks/user-conversation";
import axios from "axios";

interface BodyProps {
  initialData: FullConversationType;
}
export const Body = ({ initialData }: BodyProps) => {
  const [messages, setMessages] = useState(initialData.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  const leadName = initialData.lead.lastName as string;

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <ScrollArea className="flex-1 p-2 pr-3">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
          username={message.role === "user" ? leadName : "assistant"}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </ScrollArea>
  );
};
