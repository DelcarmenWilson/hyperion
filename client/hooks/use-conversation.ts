import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { create } from "zustand";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FullConversation, ShortConversation, ShortConvo } from "@/types";
import {
  conversationGetById,
  conversationsGetByUserId,
  conversationsGetByUserIdUnread,
  conversationUpdateByIdUnread,
} from "@/actions/lead/conversation";
import SocketContext from "@/providers/socket";
import { toast } from "sonner";

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
      enabled:!!conversationId
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

export const useConversationActions = () => {
  const { socket } = useContext(SocketContext).SocketState; 
  const queryClient = useQueryClient();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const invalidate = (key:string) => {
    queryClient.invalidateQueries({
      queryKey: [key],
    });
  };

  const { data: conversations, isFetching: conversationsFectching } = useQuery<
    ShortConvo[]
  >({
    queryKey: ["navbar-conversations"],
    queryFn: () => conversationsGetByUserIdUnread(),
  });
  
  //UPDATE CONVERSATION UNDREAD
  const { mutate: conversationUpdateByIdUnreadMutate, isPending: conversationUpdating } = useMutation({
    mutationFn: conversationUpdateByIdUnread,
    onSuccess: (results) => {
      if (results.success) {
        invalidate("navbar-conversations")
        if (results.success?.length) 
          router.push(`/conversations/${results.success}`);
        
      } else toast.error(results.error, { id: "update-conversation" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "update-conversation" });
    },
  });



    const onConversationUpdateByIdUnread = useCallback(
    (id: string) => {
      toast.loading("Deleting chat ...", { id: "delete-chat" });
      conversationUpdateByIdUnreadMutate(id);
    },
    [conversationUpdateByIdUnreadMutate]
  );



  // GENERAL FUNCTIONS
  const onPlay = () => {
    invalidate("navbar-conversations")
    if (!audioRef.current) return;
    audioRef.current.volume = 0.5;
    audioRef.current.play();
  };
  // const onMessageRecieved = (mChatId: string) => {
  //   if (mChatId == chatId) invalidate();
  //   if (pathname.startsWith("/chat")) return;
  //   invalidateNav();
  //   onPlay();
  // };


  
  useEffect(() => {
    socket?.on("conversation-message-notify", onPlay);
    return () => {
      socket?.off("conversation-message-notify", onPlay);
    };
    // eslint-disable-next-line
  }, []);
  return {
    audioRef,
    conversations, conversationsFectching,
    onConversationUpdateByIdUnread,
    conversationUpdating
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
