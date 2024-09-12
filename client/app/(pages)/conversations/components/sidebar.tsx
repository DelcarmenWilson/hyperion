"use client";
import { useContext } from "react";
import { useConversationData } from "../hooks/use-conversation";

import SocketContext from "@/providers/socket";

import { ConversationCard } from "./card";
import { EmptyCard } from "@/components/reusable/empty-card";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ConversationsSidebar = () => {
  const { socket } = useContext(SocketContext).SocketState;

  const { conversationId, conversations, isFetchingConversations } =
    useConversationData();

  // const [conversations, setConversations] = useState<ShortConversation[]>(
  //   convos || []
  // );
  // useEffect(() => {
  //   const onMessageInserted = (newMessage: Message) => {
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

  //   const onConversationSeen = (conversationId: string) => {
  //     setConversations((current) => {
  //       const convo = current.find((e) => e.id == conversationId);

  //       if (!convo) {
  //         return current;
  //       }
  //       convo.unread = 0;

  //       return [...current];
  //     });
  //   };
  //   socket?.on("conversation-messages-new", (data: { dt: Message[] }) => {
  //     data.dt.forEach((message) => onMessageInserted(message));
  //   });

  //   userEmitter.on("messageInserted", (info) => onMessageInserted(info));
  //   userEmitter.on("conversationSeen", (conversationId) =>
  //     onConversationSeen(conversationId)
  //   );
  //   return () => {
  //     userEmitter.off("conversationSeen", (conversationId) =>
  //       onConversationSeen(conversationId)
  //     );
  //     socket?.off("conversation-messages-new", (data: { dt: Message[] }) => {
  //       data.dt.forEach((message) => onMessageInserted(message));
  //     });
  //   };
  // }, []);

  return (
    <div className="flex flex-col h-full gap-1 p-1">
      <h4 className="text-lg text-muted-foreground font-semibold">
        Conversations
      </h4>
      <div className="flex-1 space-y-2 overflow-y-auto h-full">
        <SkeletonWrapper isLoading={isFetchingConversations} fullHeight>
          {conversations && conversations.length > 0 ? (
            <>
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
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
