import { useEffect, useRef } from "react";
import { usePublicChatbotStore } from "./hooks/use-chatbot";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCard } from "./message-card";

export const PublicChatbotConversationBody = () => {
  const { messages, isTyping } = usePublicChatbotStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  //TODO - messages are not scrolling to the bottom after being inserted
  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!messages) return;
    ScrollDown();
  }, [messages]);

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
      {isTyping && (
        <p className="absolute bottom-2 text-gray-500 italic">
          Titan is typing...
        </p>
      )}
    </ScrollArea>
  );
};
