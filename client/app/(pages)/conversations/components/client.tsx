"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ShortConversation, ShortConvo } from "@/types";
import { Conversation, Message } from "@prisma/client";
import { ConversationCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";

type ConversationsClientProps = {
  convos: ShortConversation[];
};
export const ConversationsClient = ({ convos }: ConversationsClientProps) => {
  const user = useCurrentUser();
  const [conversations, setConversations] =
    useState<ShortConversation[]>(convos);
  useEffect(() => {
    pusherClient.subscribe(user?.id as string);

    const convoHandler = (updatedConvo: ShortConvo) => {
      setConversations((current) => {
        const convo = current.find((e) => e.id == updatedConvo.id);
        if (convo) {
          const index = current.findIndex((e) => e.id == updatedConvo.id);
          if (!convo || index == -1) {
            return current;
          }
          convo.message = updatedConvo.lastMessage?.content!;
          convo.updatedAt = updatedConvo.updatedAt;
          current.unshift(current.splice(index, 1)[0]);

          return [...current];
        }
        return [...current];
      });
    };

    const onMessageInserted = (newMessage: Message) => {
      // if (message.role == "user" && audioRef.current) {
      //   audioRef.current.play();
      // }
      setConversations((current) => {
        const convo = current.find((e) => e.id == newMessage.conversationId);
        if (convo) {
          const index = current.findIndex(
            (e) => e.id == newMessage.conversationId
          );
          if (!convo) {
            return current;
          }
          convo.message = newMessage.content!;
          convo.updatedAt = newMessage.createdAt;
          current.unshift(current.splice(index, 1)[0]);
          return [...current];
        }
        return [...current];
      });
    };

    const onConversationSeen = (conversationId: string) => {
      setConversations((current) => {
        const convo = current.find((e) => e.id == conversationId);

        if (!convo) {
          return current;
        }
        convo.unread = 0;

        return [...current];
      });
    };
    pusherClient.bind("conversation:updated", convoHandler);
    userEmitter.on("messageInserted", (info) => onMessageInserted(info));
    userEmitter.on("conversationSeen", (conversationId) =>
      onConversationSeen(conversationId)
    );
    return () => {
      pusherClient.unsubscribe(user?.id as string);
      pusherClient.unbind("messages:new", convoHandler);
      userEmitter.off("conversationSeen", (conversationId) =>
        onConversationSeen(conversationId)
      );
    };
  }, [user?.id]);
  return (
    <div className="flex flex-col h-full w-[250px] gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">
        Conversations
      </h4>
      <div className="flex-1 space-y-2 overflow-y-auto h-full">
        {conversations.length > 0 ? (
          <>
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </>
        ) : (
          <EmptyCard title="No Conversations" />
        )}
      </div>
    </div>
  );
};
