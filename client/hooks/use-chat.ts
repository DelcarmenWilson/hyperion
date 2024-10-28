import { useCallback, useContext, useEffect } from "react";
import SocketContext from "@/providers/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { ChatMessageSchemaType } from "@/schemas/chat";
import { FullChat, FullChatMessage, ShortChat, UnreadShortChat, UserSocket } from "@/types";
import { OnlineUser } from "@/types/user";

import {
  chatGetById,
  chatMessageInsert,
  chatsGetByUserId,
  chatsGetByUserIdUnread,
  chatUpdateByIdUnread,
} from "@/actions/chat";
import { usePathname, useRouter } from "next/navigation";
import { usersGetAllChat } from "@/actions/user";

type State = {
  isChatOpen: boolean;
  onlineUsers?: OnlineUser[];
  user?: OnlineUser;
  chatId?: string;
  isChatInfoOpen: boolean;
  isGroupDialogOpen:boolean
};

type Actions = {
  onChatOpen: () => void;
  onChatClose: () => void;
  setChatId: (c?: string) => void;
  onChatInfoOpen: (u?: OnlineUser, c?: string) => void;
  onChatInfoClose: () => void;
  onGroupDialogOpen: () => void;
  onGroupDialogClose: () => void;
  updateUsers:(u:UserSocket[])=>void
  updateUser:(u:string)=>void
  fetchData: () => void;
};

export const useChatStore = create<State & Actions>()(
  immer((set) => ({
  isChatOpen: false,
  onChatOpen: () => set({ isChatOpen: true }),
  onChatClose: () => set({ user:undefined,isChatOpen: false, isChatInfoOpen: false }),

  setChatId: (c) => set({ chatId: c }),
  isChatInfoOpen: false,
  onChatInfoOpen: (u?, c?) => set({ user: u, chatId: c, isChatInfoOpen: true }),
  onChatInfoClose: () => set({user:undefined, isChatInfoOpen: false }),

  isGroupDialogOpen:false,
  onGroupDialogOpen: () => set({ isGroupDialogOpen: true }),
  onGroupDialogClose: () => set({ isGroupDialogOpen: false }),
  updateUsers:(u)=>set((state)=>{state.onlineUsers=state.onlineUsers?.map((user) => {
    return { ...user, online: !!u.find((e) => e.id == user.id) };
  });}),
  updateUser:(u)=>set((state)=>{state.onlineUsers=state.onlineUsers?.map((user) => {
    return { ...user, online: u == user.id ? false : user.online };
  });}),

  fetchData: async () => {
    const users = await usersGetAllChat();
    set({ onlineUsers: users });
  },
  }))
);


export const useChatData = (chatId: string) => {
  //TODO - THIS SHOULD PROBABLY BE MOVED TO ITS OWN HOOK - SAME FILE
  //NAVBAR CHATS
  const { data: navChats, isFetching: navChatsIsFectching } = useQuery<
    UnreadShortChat[]
  >({
    queryFn: () => chatsGetByUserIdUnread(),
    queryKey: ["navbar-chats"],
  });
  //CHAT DRAWER
  const { data: chat, isFetching: chatIsFetching } = useQuery<FullChat | null>({
    queryFn: () => chatGetById(chatId),
    queryKey: [`agent-messages-${chatId}`],
  });
  //CHATS FULL PAGE
  const { data: fullChats, isFetching: fullChatsIsFetching } = useQuery<
    ShortChat[]
  >({
    queryFn: () => chatsGetByUserId(),
    queryKey: ["agent-full-chats"],
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
  const { setChatId } = useChatStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const pathname = usePathname();

  const invalidate = () => {
    //TODO - need to find a way to optimistically set the new message
    // queryClient.setQueryData(["agentMessages", `chat-${chatId}`], (messages:FullChatMessage[]) => [...messages, newMessage])
    queryClient.invalidateQueries({
      queryKey: [`agent-messages-${chatId}`],
    });
  };
  const invalidateNav = () => {
    queryClient.invalidateQueries({
      queryKey: ["navbar-chats"],
    });
  };

  const { mutate: navMutate, isPending: navIsPending } = useMutation({
    mutationFn: chatUpdateByIdUnread,
    onSuccess: (result) => {
      if (result.success?.length) {
        setChatId(result.success);
        router.push("/chat");
      }
      invalidateNav();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: chatMessageMutate, isPending: chatMessageInsertIsPending } =
    useMutation({
      mutationFn: chatMessageInsert,
      onSuccess: (results) => {
        if (results.success) {
          //TODO - need to reinvent the real time functionality
          // socket?.emit("chat-message-sent", values.userId, results.success);
          toast.success("Chat message created", { id: "insert-chat-message" });
          invalidate();
        } else toast.error(results.error);
        if (reset) reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onChatMessageInsert = useCallback(
    (values: ChatMessageSchemaType) => {
      toast.loading("Creating new message ...", { id: "insert-chat-message" });
      chatMessageMutate(values);
    },
    [chatMessageMutate]
  );

  useEffect(() => {
    // full message
    socket?.on(
      "chat-message-received",
      (data: { message: FullChatMessage }) => {
        if (data.message.chatId == chatId) invalidate();
        if (pathname.startsWith("/chat")) return;
        invalidateNav();
        if (reset) reset();
      }
    );
    // eslint-disable-next-line
  }, []);
  return {
    invalidateNav,
    navMutate,
    navIsPending,
    onChatMessageInsert,
    chatMessageInsertIsPending,
  };
};
