import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { create } from "zustand";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { useQuery } from "@tanstack/react-query";

import { FullConversation, ShortConversation } from "@/types";
import {
  conversationGetById,
  conversationsGetByUserId,
} from "@/actions/lead/conversation";

type ConversationStore = {
  isLeadInfoOpen: boolean;
  onLeadInfoToggle: () => void;
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
  isLeadInfoOpen: false,
  onLeadInfoToggle: () => set({ isLeadInfoOpen: !get().isLeadInfoOpen  }),
}));

export const useConversationData = () => {
  const { conversationId } = useConversationId();
  const { setLeadId,setConversationId } = useLeadStore();

  const { data: conversations, isFetching: isFetchingConversations } = useQuery<
    ShortConversation[]
  >({
    queryFn: () => conversationsGetByUserId(),
    queryKey: [`conversations`],
  });

  const { data: conversation, isFetching: isFetchingConversation } =
    useQuery<FullConversation | null>({
      queryFn: () => conversationGetById(conversationId),
      queryKey: [`conversation-${conversationId}`],
    });

  useEffect(() => {
    if (!conversation) return;
    setLeadId(conversation.leadId);
    setConversationId(conversation.id)
  }, [conversation]);

  return {
    conversationId,
    conversations,
    isFetchingConversations,
    conversation,
    isFetchingConversation,
  };
};

export const useConversationId = () => {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.id) {
      return "";
    }

    return params?.id as string;
  }, [params?.id]);

  return useMemo(
    () => ({
      conversationId,
    }),
    [conversationId]
  );
};
