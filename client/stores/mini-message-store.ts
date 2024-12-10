import { create } from "zustand";

type State = {
  messageId?: string;
  isMiniMessageOpen: boolean;
};
type Actions = {
  onMiniMessageOpen: (m: string) => void;
  onMiniMessageClose: () => void;
};

export const useMiniMessageStore = create<State & Actions>((set) => ({
    //  messageId: "cm30nyurz001587wugvl5np8f",
    isMiniMessageOpen: false,
    onMiniMessageOpen: (m) => set({ isMiniMessageOpen: true, messageId: m }),
    onMiniMessageClose: () => set({ isMiniMessageOpen: false, messageId: undefined }),
  }));