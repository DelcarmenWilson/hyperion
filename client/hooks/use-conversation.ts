import { useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { create } from "zustand";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSocketStore } from "./use-socket-store";
import { useInvalidate } from "./use-invalidate";

import { FullConversation, ShortConversation, ShortConvo } from "@/types";

import {
  getConversation,
  getConversations,
  getUnreadConversations,
  updateUnreadConversation,
} from "@/actions/lead/conversation";

type ConversationStore = {
  isLeadInfoOpen: boolean;
  onLeadInfoToggle: () => void;
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
  isLeadInfoOpen: false,
  onLeadInfoToggle: () => set({ isLeadInfoOpen: !get().isLeadInfoOpen }),
}));

export const useConversationData = () => {
  const { conversationId } = useConversationId();

  const onGetConversations = () => {
    const {
      data: conversations,
      isFetching: conversationsFetching,
      isLoading: conversationsLoading,
    } = useQuery<ShortConversation[]>({
      queryFn: () => getConversations(),
      queryKey: [`conversations`],
    });
    return {
      conversations,
      conversationsFetching,
      conversationsLoading,
    };
  };
  const onGetConversation = () => {
    const {
      data: conversation,
      isFetching: conversationFetching,
      isLoading: conversationLoading,
    } = useQuery<FullConversation | null>({
      queryFn: () => getConversation(conversationId),
      queryKey: [`conversation-${conversationId}`],
      enabled: !!conversationId,
    });
    return {
      conversation,
      conversationFetching,
      conversationLoading,
    };
  };
  const onGetUnreadConversation = () => {
    const {
      data: unreadConversations,
      isFetching: unreadConversationsFetching,
      isLoading: unreadConversationsLoading,
    } = useQuery<ShortConvo[]>({
      queryKey: ["navbar-conversations"],
      queryFn: () => getUnreadConversations(),
    });
    return {
      unreadConversations,
      unreadConversationsFetching,
      unreadConversationsLoading,
    };
  };

  return {
    onGetUnreadConversation,
    onGetConversations,
    onGetConversation,
  };
};

export const useConversationActions = () => {
  const { socket } = useSocketStore();
  const { invalidate } = useInvalidate();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  //UPDATE UNDREAD CONVERSATION
  const {
    mutate: updateUnreadConversationMutate,
    isPending: unreadConversationUpdating,
  } = useMutation({
    mutationFn: updateUnreadConversation,
    onSuccess: (results) => {
      invalidate("navbar-conversations");
      if (results.success?.length)
        router.push(`/conversations/${results.success}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const onUpdateUnreadConversation = useCallback(
    (id: string) => {
      updateUnreadConversationMutate(id);
    },
    [updateUnreadConversationMutate]
  );

  // GENERAL FUNCTIONS
  const onPlay = () => {
    invalidate("navbar-conversations");
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };

  useEffect(() => {
    socket?.on("conversation-message-notify", onPlay);
    return () => {
      socket?.off("conversation-message-notify", onPlay);
    };
    // eslint-disable-next-line
  }, []);
  return {
    audioRef,
    onUpdateUnreadConversation,
    unreadConversationUpdating,
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
