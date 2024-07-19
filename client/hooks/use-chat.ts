import { useContext, useEffect, useState } from "react";
import SocketContext from "@/providers/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { create } from "zustand";

import { ChatMessageSchemaType } from "@/schemas/chat";
import { FullChat, FullChatMessage, ShortChat, UnreadShortChat } from "@/types";
import { OnlineUser } from "@/types/user";

import {
  chatGetById,
  chatMessageInsert,
  chatsGetByUserId,
  chatsGetByUserIdUnread,
  chatUpdateByIdUnread,
} from "@/actions/chat";
import { usePathname, useRouter } from "next/navigation";

type useChatStore = {
  isChatOpen: boolean;
  onChatOpen: () => void;
  onChatClose: () => void;

  user?: OnlineUser;
  chatId?: string;
  setChatId: (c?: string) => void;
  isChatInfoOpen: boolean;
  onChatInfoOpen: (u?: OnlineUser, c?: string) => void;
  onChatInfoClose: () => void;
};

export const useChat = create<useChatStore>((set) => ({
  isChatOpen: false,
  onChatOpen: () => set({ isChatOpen: true }),
  onChatClose: () => set({ isChatOpen: false, isChatInfoOpen: false }),

  setChatId: (c) => set({ chatId: c }),
  isChatInfoOpen: false,
  onChatInfoOpen: (u?, c?) => set({ user: u, chatId: c, isChatInfoOpen: true }),
  onChatInfoClose: () => set({ isChatInfoOpen: false }),
}));

export const useChatData = (chatId: string) => {
  //TODO - THIS SHOULD PROBABLY BE MOVED TO ITS OWN HOOK - SAME FILE
  //NAVBAR CHATS
  const { data: navChats, isFetching: navChatsIsFectching } = useQuery<
    UnreadShortChat[]
  >({
    queryKey: ["navbarChats"],
    queryFn: () => chatsGetByUserIdUnread(),
  });
  //CHAT DRAWER
  const { data: chat, isFetching: chatIsFetching } = useQuery<FullChat | null>({
    queryKey: ["agentMessages", `chat-${chatId}`],
    queryFn: () => chatGetById(chatId),
  });
  //CHATS FULL PAGE
  const { data: fullChats, isFetching: fullChatsIsFetching } = useQuery<
    ShortChat[]
  >({
    queryKey: ["agentFullChats"],
    queryFn: () => chatsGetByUserId(),
  });

  return {
    navChats,
    navChatsIsFectching,
    chat,
    chatIsFetching,
    fullChats,
    fullChatsIsFetching,
  };
};

export const useChatActions = (chatId: string, reset?: () => void) => {
  const { socket } = useContext(SocketContext).SocketState;
  const {setChatId}=useChat()
  const queryClient = useQueryClient();
  const router = useRouter();

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const invalidate = () => {
    //TODO - need to find a way to optimistically set the new message
    // queryClient.setQueryData(["agentMessages", `chat-${chatId}`], (messages:FullChatMessage[]) => [...messages, newMessage])
    queryClient.invalidateQueries({
      queryKey: ["agentMessages", `chat-${chatId}`],
    });
  };
  const invalidateNav = () => {
    queryClient.invalidateQueries({
      queryKey: ["navbarChats"],
    });
  };

  const { mutate: navMutate, isPending: navIsPending } = useMutation({
    mutationFn: chatUpdateByIdUnread,
    onSuccess: (result) => {
      if (result.success?.length) {
        setChatId(result.success)
        router.push("/chat");
      }
      invalidateNav();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onChatMessageInsert = async (values: ChatMessageSchemaType) => {
    setLoading(true);
    const message = await chatMessageInsert(values);
    if (message.success) {
      invalidate();
      socket?.emit("chat-message-sent", values.userId, message.success);
    } else toast.error(message.error);
    if (reset) reset();
    setLoading(false);
  };
  useEffect(() => {
    // full message
    socket?.on("chat-message-received", (data: { message: FullChatMessage }) => {
      if (data.message.chatId == chatId) invalidate();
      if (pathname.startsWith("/chat")) return;
      invalidateNav();
      if (reset) reset();
    });
    // eslint-disable-next-line
  }, []);
  return {
    loading,
    invalidateNav,
    navMutate,
    navIsPending,
    onChatMessageInsert,
  };
};
