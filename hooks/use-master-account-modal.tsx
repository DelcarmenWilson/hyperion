import { create } from "zustand";

interface MasterAccountModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMasterAccountModal = create<MasterAccountModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
