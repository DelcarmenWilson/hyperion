"use client";
import { useState } from "react";

import { userEmitter } from "@/lib/event-emmiter";

import { GptConversation, GptMessage } from "@prisma/client";
import { GptConversationCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";

export const GptConversationsClient = ({
  initConversations,
}: {
  initConversations: GptConversation[];
}) => {
  const [conversations, setConversations] =
    useState<GptConversation[]>(initConversations);
  // useEffect(() => {
  //   const onMessageInserted = (newMessage: GptMessage) => {
  //     if (!newMessage) return;

  //     setConversations((current) => {
  //       const convo = current.find((e) => e.id == newMessage.conversationId);
  //       if (convo) {
  //         const index = current.findIndex(
  //           (e) => e.id == newMessage.conversationId
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

  //   userEmitter.on("gptMessageInserted", (info) => onMessageInserted(info));

  //   return () => {
  //     userEmitter.off("gptMessageInserted", (info) => onMessageInserted(info));
  //   };
  // }, []);
  return (
    <div className="flex flex-col h-full w-[250px] gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">
        Conversations
      </h4>
      <div className="flex-1 space-y-2 overflow-y-auto h-full">
        {conversations.length > 0 ? (
          <>
            {conversations.map((conversation) => (
              <GptConversationCard
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
