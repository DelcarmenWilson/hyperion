"use client";

import { useEffect, useState } from "react";

import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";

import { ShortChat } from "@/types";
import { ChatCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";

type ChatsClientProps = {
  initChats: ShortChat[];
};
export const ChatsClient = ({ initChats }: ChatsClientProps) => {
  const user = useCurrentUser();
  const [chats, setChats] = useState<ShortChat[]>(initChats);
  // useEffect(() => {
  //   // pusherClient.subscribe(user?.id as string);

  //   const convoHandler = (updatedConvo: Chat) => {
  //     // if (message.role == "user" && audioRef.current) {
  //     //   audioRef.current.play();
  //     // }
  //     setChats((current) => {
  //       if (find(current, { id: updatedConvo.id })) {
  //         const convo = current.find((e) => e.id == updatedConvo.id);
  //         const index = current.findIndex((e) => e.id == updatedConvo.id);
  //         if (!convo) {
  //           return current;
  //         }
  //         convo.message = updatedConvo.lastMessage!;
  //         convo.updatedAt = updatedConvo.updatedAt;
  //         current.unshift(current.splice(index, 1)[0]);

  //         return [...current];
  //       }
  //       return [...current];
  //     });
  //   };

  //   const onMessageInserted = (newMessage: Message) => {
  //     // if (message.role == "user" && audioRef.current) {
  //     //   audioRef.current.play();
  //     // }
  //     setChats((current) => {
  //       if (find(current, { id: newMessage.chatId })) {
  //         const convo = current.find((e) => e.id == newMessage.chatId);
  //         const index = current.findIndex(
  //           (e) => e.id == newMessage.chatId
  //         );
  //         if (!convo) {
  //           return current;
  //         }
  //         convo.message = newMessage.content!;
  //         convo.updatedAt = newMessage.createdAt;
  //         current.unshift(current.splice(index, 1)[0]);
  //         return [...current];
  //       }
  //       return [...current];
  //     });
  //   };

  //   const onChatSeen = (chatId: string) => {
  //     setChats((current) => {
  //       if (find(current, { id: chatId })) {
  //         const convo = current.find((e) => e.id == chatId);
  //         if (!convo) {
  //           return current;
  //         }
  //         convo.unread = 0;

  //         return [...current];
  //       }
  //       return [...current];
  //     });
  //   };
  //   // pusherClient.bind("messages:new", convoHandler);
  //   userEmitter.on("messageInserted", (info) => onMessageInserted(info));
  //   userEmitter.on("chatSeen", (chatId) =>
  //     onChatSeen(chatId)
  //   );
  //   return () => {
  //     // pusherClient.unsubscribe(user?.id as string);
  //     // pusherClient.unbind("messages:new", convoHandler);
  //     userEmitter.off("chatSeen", (chatId) =>
  //       onChatSeen(chatId)
  //     );
  //   };
  // }, [user?.id]);
  return (
    <div className="flex flex-col h-full w-[250px] gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">Chats</h4>
      <div className="flex-1 space-y-2 overflow-y-auto h-full">
        {chats.length > 0 ? (
          <>
            {chats.map((chat) => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </>
        ) : (
          <EmptyCard title="No Chats" />
        )}
      </div>
    </div>
  );
};
