
import { create } from "zustand";

type State = {
  isSmsFormOpen: boolean;
  onSmsFormToggle: () => void;
  isDialPadFormOpen: boolean;
  onDialPadFormToggle: () => void;
};

export const useDialerStore = create<State>((set, get) => ({
  isSmsFormOpen: false,
  onSmsFormToggle: () => set({ isSmsFormOpen: !get().isSmsFormOpen  }),
  isDialPadFormOpen: false,
  onDialPadFormToggle:()=>set({ isDialPadFormOpen: !get().isDialPadFormOpen  }),
}));
