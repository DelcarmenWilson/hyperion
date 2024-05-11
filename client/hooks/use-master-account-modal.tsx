import { create } from "zustand";

type MasterAccountModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useMasterAccountModal = create<MasterAccountModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
