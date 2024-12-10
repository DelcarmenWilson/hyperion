import { create } from "zustand";

type useChatbotStore = { 
    chatId?: string;
    setChatId: (c?: string) => void;
  };
  
  export const useChatbot = create<useChatbotStore>((set) => ({
    setChatId: (c) => set({ chatId: c }),
  }));