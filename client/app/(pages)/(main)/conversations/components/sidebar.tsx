"use client";
import { useEffect } from "react";
import {
  useConversationData,
  useConversationId,
} from "@/hooks/use-conversation";

import { ConversationCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ConversationsSidebar = () => {
  const { onGetConversations } = useConversationData();
  const { conversations, conversationsFetching } = onGetConversations();
  const { conversationId } = useConversationId();

  return (
    <div className="flex flex-col h-full gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">
        Conversations
      </h4>
      <div className="flex-1 space-y-2 overflow-hidden overflow-y-auto h-full">
        <SkeletonWrapper isLoading={conversationsFetching} fullHeight>
          {conversations && conversations.length > 0 ? (
            <>
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  id={conversation.id}
                  body={conversation.message}
                  firstName={conversation.firstName}
                  lastName={conversation.lastName}
                  unread={conversation.unread}
                  lastDate={conversation.updatedAt}
                  active={conversationId == conversation.id}
                />
              ))}
            </>
          ) : (
            <EmptyCard title="No Conversations" />
          )}
        </SkeletonWrapper>
      </div>
    </div>
  );
};
