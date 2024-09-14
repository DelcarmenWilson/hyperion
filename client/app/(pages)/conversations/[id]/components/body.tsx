"use client";
import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "@/providers/socket";

import axios from "axios";
import { useConversationId } from "@/app/(pages)/conversations/hooks/use-conversation";

import { FullConversation, FullMessage } from "@/types";
import { MessageBox } from "@/components/reusable/message-box";

export const Body = ({ initialData }: { initialData: FullConversation }) => {
  const { socket } = useContext(SocketContext).SocketState;
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState(initialData.messages);
  const { conversationId } = useConversationId();

  const leadName = initialData.lead.lastName as string;

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessage) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        const existingMessage = current.find((e) => e.id == message.id);
        if (existingMessage) {
          return current;
        }
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    socket?.on("conversation-messages-new", (data: { dt: FullMessage[] }) => {
      data.dt.forEach((message) => messageHandler(message));
    });
    return () => {
      socket?.off(
        "conversation-messages-new",
        (data: { dt: FullMessage[] }) => {
          data.dt.forEach((message) => messageHandler(message));
        }
      );
    };
  }, [conversationId, messages]);

  return (
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
    </div>
  );
};
