
import { create } from "zustand";

type State = {
  isSmsFormOpen: boolean;
  isDialPadFormOpen: boolean;
};
type Actions = {
  onSmsFormToggle: () => void;
  onDialPadFormToggle: () => void;
};
export const useDialerStore = create<State &Actions>((set, get) => ({
  isSmsFormOpen: false,
  onSmsFormToggle: () => set({ isSmsFormOpen: !get().isSmsFormOpen  }),
  isDialPadFormOpen: false,
  onDialPadFormToggle:()=>set({ isDialPadFormOpen: !get().isDialPadFormOpen  }),
}));
