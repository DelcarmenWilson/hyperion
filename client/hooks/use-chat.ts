import { OnlineUser } from "@/types/user";
import { create } from "zustand";

type useChatStore = {
  isChatOpen: boolean;
  onChatOpen: () => void;
  onChatClose: () => void;

  user?: OnlineUser;
  chatId?:string;
  setChatId:(c?: string) => void;
  isChatInfoOpen: boolean;
  onChatInfoOpen: (u?: OnlineUser) => void;
  onChatInfoClose: () => void;
};

export const useChat = create<useChatStore>((set) => ({
  isChatOpen: false,
  onChatOpen: () => set({ isChatOpen: true }),
  onChatClose: () => set({ isChatOpen: false,isChatInfoOpen: false  }),
  
  setChatId: (c) => set({ chatId: c }),
  isChatInfoOpen: false,
  onChatInfoOpen: (u?) => set({user:u, isChatInfoOpen: true }),
  onChatInfoClose: () => set({ isChatInfoOpen: false }),
}));
