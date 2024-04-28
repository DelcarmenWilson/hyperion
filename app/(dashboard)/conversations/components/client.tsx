"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useCurrentUser } from "@/hooks/use-current-user";
import { find } from "lodash";
import { ShortConversation } from "@/types";
import { Conversation } from "@prisma/client";
import { ConversationCard } from "./card";

type ConversationsClientProps = {
  convos: ShortConversation[];
};
export const ConversationsClient = ({ convos }: ConversationsClientProps) => {
  const user = useCurrentUser();
  const [conversations, setConversations] =
    useState<ShortConversation[]>(convos);
  useEffect(() => {
    pusherClient.subscribe(user?.id as string);

    const convoHandler = (updatedConvo: Conversation) => {
      // if (message.role == "user" && audioRef.current) {
      //   audioRef.current.play();
      // }
      setConversations((current) => {
        if (find(current, { id: updatedConvo.id })) {
          const convo = current.find((e) => e.id == updatedConvo.id);
          const index = current.findIndex((e) => e.id == updatedConvo.id);
          if (!convo) {
            return current;
          }
          convo.message = updatedConvo.lastMessage!;
          convo.updatedAt = updatedConvo.updatedAt;
          current.unshift(current.splice(index, 1)[0]);

          return [...current];
        }
        return [...current];
      });
    };
    pusherClient.bind("messages:new", convoHandler);
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("messages:new", convoHandler);
    };
  }, [user?.id]);
  return (
    <div className="flex flex-col h-full w-[250px] gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">
        Conversations
      </h4>
      <div className="flex-1 space-y-2 overflow-y-auto h-full">
        {conversations.map((conversation) => (
          <ConversationCard key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
};
