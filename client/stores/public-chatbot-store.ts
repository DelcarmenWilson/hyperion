import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { PublicChatbotMessage } from "@prisma/client";

type State = {
  messages: PublicChatbotMessage[];
  isTyping: boolean;
};
type Actions = {
  setMessages: (m: PublicChatbotMessage[]) => void;
  addMessage: (m: PublicChatbotMessage) => void;
  setIsTyping: () => void;
};

export const usePublicChatbotStore = create<State & Actions>()(
  immer((set) => ({
    messages: [],
    setMessages: (m) => set({ messages: m }),
    addMessage: (m) =>
      set((state) => {
        state.messages?.push(m);
      }),

    isTyping: false,
    setIsTyping: () =>
      set((state) => {
        state.isTyping = !state.isTyping;
      }),
  }))
);

const publicConversationAtom = atomWithStorage<{ conversationId?: string }>(
  "publicConversation",
  {}
);
export const usePublicConversationAtom = () => useAtom(publicConversationAtom);
