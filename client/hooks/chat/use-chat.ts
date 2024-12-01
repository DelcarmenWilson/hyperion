import { useCallback, useContext, useEffect, useRef, useState } from "react";
import SocketContext from "@/providers/socket";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "../use-invalidate";
import { useSocketStore } from "../use-socket-store";
import { useCurrentUser } from "../user/use-current";

import Quill from "quill";
import { Delta } from "quill/core";
import { toast } from "sonner";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  CreateChatMessageSchemaType,
} from "@/schemas/chat";
import { FullChat, ShortChat, UnreadShortChat, UserSocket } from "@/types";
import { OnlineUser } from "@/types/user";

import { getUsersChat } from "@/actions/user";
import {
  chatSettingsGet,
  chatSettingsToggleOnline,
} from "@/actions/settings/chat";

import { createChat } from "@/actions/chat/create-chat";
import { getChat } from "@/actions/chat/get-chat";
import { getChats } from "@/actions/chat/get-chats";
import { getUnreadChats } from "@/actions/chat/get-unread-chats";
import { updateUnreadChat } from "@/actions/chat/update-unread-chat";
import { deleteMessages } from "@/actions/chat/message/delete-messages";
import { deleteMessage } from "@/actions/chat/message/delete-message";
import { createMessage } from "@/actions/chat/message/create-message";
import { updateMessage } from "@/actions/chat/message/update-message";
import { toggleReaction } from "@/actions/chat/reaction/toggle-reaction";

type State = {
  isChatOpen: boolean;
  allUsers: OnlineUser[];
  user?: OnlineUser;
  chatId?: string;
  isChatInfoOpen: boolean;
  isGroupDialogOpen: boolean;
  masterUnread: number;
  showOnline: boolean;
  loaded: boolean;
};

type Actions = {
  onChatOpen: () => void;
  onChatClose: () => void;
  setChatId: (c?: string) => void;
  onChatInfoOpen: (u?: OnlineUser, c?: string) => void;
  onChatInfoClose: () => void;
  onGroupDialogOpen: () => void;
  onGroupDialogClose: () => void;
  onMessageRecieved: (userId: string, chatId: string, content: string) => void;
  updateUsers: (u: UserSocket[]) => void;
  onUserConnectDisconnect: (u: string, status: boolean) => void;
  onShowOnlineToggle: () => void;
  fetchData: () => void;
};

export const useChatStore = create<State & Actions>()(
  immer((set, get) => ({
    allUsers: [],
    masterUnread: 0,
    showOnline: false,
    isChatOpen: false,
    loaded: false,
    onChatOpen: () => set({ isChatOpen: true }),
    onChatClose: () =>
      set({ user: undefined, isChatOpen: false, isChatInfoOpen: false }),

    setChatId: (c) => set({ chatId: c }),
    isChatInfoOpen: false,
    onChatInfoOpen: (u?, c?) => {
      const idx = get().allUsers.findIndex((e) => e.id == u?.id);
      const unread = get().allUsers[idx].unread;
      set((state) => {
        state.allUsers[idx].unread = 0;
        state.allUsers[idx].chatId = c;
        state.masterUnread = get().masterUnread - unread;
      });

      set({ user: u, chatId: c, isChatInfoOpen: true });
    },
    onChatInfoClose: () => set({ user: undefined, isChatInfoOpen: false }),

    isGroupDialogOpen: false,
    onGroupDialogOpen: () => set({ isGroupDialogOpen: true }),
    onGroupDialogClose: () => set({ isGroupDialogOpen: false }),
    onMessageRecieved: (id: string, c: string, msg: string) => {
      const idx = get().allUsers.findIndex((e) => e.id == id);
      const unread = get().allUsers[idx].unread;
      set((state) => {
        state.allUsers[idx].unread = unread + 1;
        state.allUsers[idx].chatId = c;
        state.masterUnread = get().masterUnread + 1;
      });
    },
    updateUsers: (onlineUsers) =>
      set({
        allUsers: get().allUsers.map((user) => {
          return {
            ...user,
            online: onlineUsers.find((e) => e.id == user.id) ? true : false,
          };
        }),
      }),

    onUserConnectDisconnect: (u, status) => {
      set((state) => {
        state.allUsers = state.allUsers.map((user) => {
          return { ...user, online: u == user.id ? status : user.online };
        });
        if (state.user?.id == u) state.user = { ...state.user, online: status };
      });
    },
    onShowOnlineToggle: () => {
      set((state) => {
        state.showOnline = !get().showOnline;
      });
    },
    fetchData: async () => {
      const users = await getUsersChat();
      const settings = await chatSettingsGet();
      set({
        allUsers: users,
        masterUnread: users.reduce((sum, usr) => sum + usr.unread, 0),
        showOnline: settings?.online,
      });
      setTimeout(() => {
        set({ loaded: true });
      }, 2000);
    },
  }))
);

export const useChatData = () => {
  const { chatId } = useChatStore();
  //TODO - THIS SHOULD PROBABLY BE MOVED TO ITS OWN HOOK - SAME FILE
  //NAVBAR CHATS
  const onNavChatsGet = () => {
    const {
      data: navChats,
      isFetching: navChatsIsFectching,
      isLoading: navChatsIsLoading,
    } = useQuery<UnreadShortChat[]>({
      queryFn: () => getUnreadChats(),
      queryKey: ["chats"],
    });
    return {
      navChats,
      navChatsIsFectching,
      navChatsIsLoading,
    };
  };
  //CHAT DRAWER
  const onChatGet = () => {
    const {
      data: chat,
      isFetching: chatIsFetching,
      isLoading: chatIsLoading,
    } = useQuery<FullChat | null>({
      queryFn: () => getChat(chatId as string),
      queryKey: [`chat-${chatId}`],
      enabled: !!chatId,
    });
    return { chat, chatIsFetching, chatIsLoading };
  };
  //CHATS FULL PAGE
  const onFullChatsGet = () => {
    const {
      data: fullChats,
      isFetching: fullChatsFetching,
      isLoading: fullChatsLoading,
    } = useQuery<ShortChat[]>({
      queryFn: () => getChats(),
      queryKey: ["full-chats"],
    });
    return { fullChats, fullChatsFetching, fullChatsLoading };
  };

  return {
    onNavChatsGet,
    onChatGet,
    onFullChatsGet,
  };
};

export const useChatActions = () => {
  const { socket } = useSocketStore();
  const { user, chatId, setChatId } = useChatStore();
  const { invalidate } = useInvalidate();
  const router = useRouter();

  const invalidateNav = () => {
    invalidate("navbar-chats");
  };

  const { mutate: navUpdateMutate, isPending: navUpdating } = useMutation({
    mutationFn: updateUnreadChat,
    onSuccess: () => {
      router.push("/chat");
      invalidate("navbar-chats");
    },
    onError: (error) => toast.error(error.message, { id: "delete-chat" }),
  });

  const { mutate: chatDeleteMutate, isPending: chatDeleting } = useMutation({
    mutationFn: deleteMessages,
    onSuccess: (results) => {
      invalidate(`chat-${results}`);
      invalidate("full-chats");
      setChatId(undefined);
      sendChatAction(results!, "deleteChat");
      toast.success("Chat deleted", { id: "delete-chat" });
    },
    onError: (error) => toast.error(error.message, { id: "delete-chat" }),
  });

  const onChatDelete = useCallback(() => {
    if (!chatId) return;
    toast.loading("Deleting chat ...", { id: "delete-chat" });
    chatDeleteMutate(chatId);
  }, [chatDeleteMutate, chatId]);

  //INSERT CHAT
  const { mutate: chatInsertMutate, isPending: chatInserting } = useMutation({
    mutationFn: createChat,
    onSuccess: (results) => {
      setChatId(results);
      invalidate("full-chats");
      toast.success("Chat created", { id: "insert-chat" });
    },
    onError: (error) => toast.error(error.message, { id: "insert-chat" }),
  });

  const onChatInsert = useCallback(
    (userId: string) => {
      toast.loading("Creating new chat ...", { id: "insert-chat" });
      chatInsertMutate(userId);
    },
    [chatInsertMutate]
  );

  // GENERAL FUNCTIONS

  const sendChatAction = (chatId: string, action: string) => {
    socket?.emit("chat-action-sent", user?.id, chatId, action);
  };

  return {
    invalidateNav,
    navUpdateMutate,
    navUpdating,
    onChatInsert,
    chatInserting,
    onChatDelete,
    chatDeleting,
  };
};

export const useChatMessageActions = () => {
  const { socket } = useSocketStore();
  const { chatId, user } = useChatStore();
  const { invalidate, invalidateMultiple } = useInvalidate();

  // DELETE MESSAGE
  const { mutate: chatMessageDeleteMutate, isPending: chatMessageDeleting } =
    useMutation({
      mutationFn: deleteMessage,
      onSuccess: (results) => {
        invalidate(`chat-${results}`);
        toast.success("Chat message deleted", { id: "delete-chat-message" });
      },
      onError: (error) =>
        toast.error(error.message, { id: "delete-chat-message" }),
    });

  const onChatMessageDelete = useCallback(
    (id: string) => {
      toast.loading("Deleting message ...", { id: "delete-chat-message" });
      chatMessageDeleteMutate(id);
    },
    [chatMessageDeleteMutate]
  );

  // INSERT MESSAGE
  const { mutate: chatMessageInsertMutate, isPending: chatMessageInserting } =
    useMutation({
      mutationFn: createMessage,
      onSuccess: (results) => {
        invalidateMultiple([`chat-${results.chatId}`, "full-chats"]);
        socket?.emit("chat-message-sent", user?.id, results);
      },
      onError: (error) =>
        toast.error(error.message),
    });

  const onChatMessageInsert = useCallback(
    (values: CreateChatMessageSchemaType) => {
      chatMessageInsertMutate(values);
    },
    [chatMessageInsertMutate]
  );

  // UPDATE
  const { mutate: chatMessageUpdateMutate, isPending: chatMessageUpdating } =
    useMutation({
      mutationFn: updateMessage,
      onSuccess: (results) => {
        invalidate(`chat-${results}`);
      },
      onError: (error) =>
        toast.error(error.message, { id: "update-chat-message" }),
    });

  const onChatMessageUpdate = useCallback(
    (values: { id: string; body: string }) => {
      toast.loading("Updating message ...", { id: "update-chat-message" });
      chatMessageUpdateMutate(values);
    },
    [chatMessageUpdateMutate]
  );

  return {
    onChatMessageDelete,
    chatMessageDeleting,
    onChatMessageInsert,
    chatMessageInserting,
    onChatMessageUpdate,
    chatMessageUpdating,
  };
};

export const useChatMessageReactionActions = () => {
  const { chatId } = useChatStore();
  const { invalidate } = useInvalidate();

  // CHAT MESSAGE REACTION UPSERT
  const {
    mutate: onChatMessageReactionToggle,
    isPending: chatMessageReactionToggling,
  } = useMutation({
    mutationFn: toggleReaction,
    onSuccess: () => {
      invalidate(`chat-${chatId}`);
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    onChatMessageReactionToggle,
    chatMessageReactionToggling,
  };
};

//TODO - this may not belong here, not sure yet

export const useChatFormActions = () => {
  const { socket } = useContext(SocketContext).SocketState;
  const editorRef = useRef<Quill | null>(null);

  const [key, setKey] = useState(0);
  const { chatId, user: agent } = useChatStore();
  const user = useCurrentUser();
  const { onChatMessageInsert, chatMessageInserting } = useChatMessageActions();
  const [typing, setTyping] = useState(false);

  const onTyping = () => {
    socket?.emit("chat-is-typing-sent", agent?.id, user?.id);
  };

  const handleSumbit = ({
    body,
    image,
    templateImage,
  }: {
    body: Delta;
    image: File | null;
    templateImage: string | null;
  }) => {
    const message: CreateChatMessageSchemaType = {
      // body: body.ops[0].insert as string,
      body: JSON.stringify(body),
      //@ts-ignore
      image: templateImage,
      chatId:chatId as string,
      senderId: user?.id!,
    };
    onChatMessageInsert(message);
    setKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!agent?.id) return;
    const recieveTyping = () => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 2000);
    };
    socket?.on("chat-is-typing-received", (data: { myUserId: string }) => {
      if (data.myUserId == agent.id) recieveTyping();
    });
  }, [agent?.id]);

  return {
    agent,
    key,
    handleSumbit,
    chatMessageInserting,
    editorRef,
    typing,
    onTyping,
  };
};

//TODO - see if can move this into its own file maybe even the settings hook
export const useChatOnlineActions = () => {
  const { onShowOnlineToggle } = useChatStore();
  // TOGGLE ONLINE
  const {
    mutate: onChatSettingsOnlineToggleMutate,
    isPending: chatSettingsOnlineToggling,
  } = useMutation({
    mutationFn: chatSettingsToggleOnline,
    onSuccess: (results) => {
      if (results.success) onShowOnlineToggle();
      else toast.error(results.error);
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    onChatSettingsOnlineToggleMutate,
    chatSettingsOnlineToggling,
  };
};
