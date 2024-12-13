import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { UserSocket } from "@/types";
import { OnlineUser } from "@/types/user";

import { getUsersChat } from "@/actions/user";
import { chatSettingsGet } from "@/actions/settings/chat";

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
      if(get().loaded)return
      const users = await getUsersChat();
      const settings = await chatSettingsGet();
      set({
        allUsers: users,
        masterUnread: users.reduce((sum, usr) => sum + usr.unread, 0),
        showOnline: settings?.online,
      });
      setTimeout(() => {
        set({ loaded: true });
      }, 1000);
    },
  }))
);
