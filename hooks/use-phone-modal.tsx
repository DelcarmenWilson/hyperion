import { create } from "zustand";

interface usePhoneModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePhoneModal = create<usePhoneModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
