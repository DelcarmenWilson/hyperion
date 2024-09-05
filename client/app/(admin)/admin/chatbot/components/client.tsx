"use client";
import { useEffect, useState } from "react";
import { Plus, Settings } from "lucide-react";

import { userEmitter } from "@/lib/event-emmiter";

import { ShortChatbotConversation } from "@/types";

import { Button } from "@/components/ui/button";
import { EmptyCard } from "@/components/reusable/empty-card";
import { ChatbotConversationCard } from "./card";

import { ChatSettingsForm } from "./form";
import { useChatbotData } from "../hooks/use-chatbot";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const GptConversationsClient = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    chatId,
    conversations,
    isFetchingConversations,
    onChatbotConversationInsert,
  } = useChatbotData();

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
    <>
      <ChatSettingsForm
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <div className="flex flex-col h-full gap-1 p-1">
        <SkeletonWrapper isLoading={isFetchingConversations}>
          <div className="flex justify-between items-center">
            <h4 className="text-lg text-muted-foreground font-semibold">
              Chat History
            </h4>

            <Button size={"icon"} onClick={onChatbotConversationInsert}>
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto h-full">
            {conversations && conversations.length > 0 ? (
              <>
                {conversations.map((conversation) => (
                  <ChatbotConversationCard
                    key={conversation.id}
                    active={chatId == conversation.id}
                    conversation={conversation}
                  />
                ))}
              </>
            ) : (
              <EmptyCard
                title="No Chat History"
                subTitle={
                  <Button onClick={onChatbotConversationInsert}>
                    Start Now
                  </Button>
                }
              />
            )}
          </div>
          <div className="flex justify-end border-t pt-2">
            <Button
              size={"icon"}
              variant="ghost"
              onClick={() => setDialogOpen(true)}
            >
              <Settings size={16} />
            </Button>
          </div>
        </SkeletonWrapper>
      </div>
    </>
  );
};
