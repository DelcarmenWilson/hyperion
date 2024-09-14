
import { create } from "zustand";

type DialerStore = {
  isSmsFormOpen: boolean;
  onSmsFormToggle: () => void;
};

export const useDialerStore = create<DialerStore>((set, get) => ({
  isSmsFormOpen: false,
  onSmsFormToggle: () => set({ isSmsFormOpen: !get().isSmsFormOpen  }),
}));
