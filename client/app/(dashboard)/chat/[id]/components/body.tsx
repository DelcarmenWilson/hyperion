import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "@/providers/socket";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";

import { User } from "@prisma/client";
import { FullChatMessage } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatMessageCard } from "./message-card";
import { toast } from "sonner";

type ChatBodyProps = {
  chatId: string;
  initMessages?: FullChatMessage[];
  otherUser: User;
};

export const ChatBody = ({
  chatId,
  initMessages,
  otherUser,
}: ChatBodyProps) => {
  const { socket } = useContext(SocketContext).SocketState;
  const user = useCurrentUser();

  const [messages, setMessages] = useState(initMessages);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  //TODO - messages are not scrolling to the bottom after being inserted
  const ScrollDown = () => {
    if (bottomRef.current) {
      const parent = bottomRef.current.parentElement?.parentElement;
      const top = bottomRef.current.offsetTop;
      parent?.scrollTo({ top, behavior: "smooth" });
    }
  };

  const onSetMessage = (newMessage: FullChatMessage) => {
    const existing = messages?.find((e) => e.id == newMessage.id);
    if (existing != undefined) return;

    setMessages((messages) => [...messages!, newMessage]);
    ScrollDown();
  };

  useEffect(() => {
    ScrollDown();
    socket?.on("chat-message-received", (message: FullChatMessage) => {
      if (message.chatId == chatId) onSetMessage(message);
    });
    userEmitter.on("chatMessageInserted", (info) => {
      socket?.emit("chat-message-sent", otherUser.id, info);
      onSetMessage(info);
    });
    return () => {
      userEmitter.off("chatMessageInserted", (info) => onSetMessage(info));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <ScrollArea className="flex flex-col flex-1 w-full rounded-sm p-4">
      {!messages?.length && (
        <p className="text-center text-muted-foreground">
          No messages have been sent
        </p>
      )}
      {messages?.map((message) => (
        <ChatMessageCard
          key={message.id}
          message={message}
          role={message.senderId == user?.id ? "user" : "otherUser"}
        />
      ))}
      <div ref={bottomRef} className="pt-2" />
      <audio ref={audioRef} src="/sounds/message.mp3" />
    </ScrollArea>
  );
};
