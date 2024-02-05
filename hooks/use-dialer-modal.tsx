import { create } from "zustand";
import { FullLead } from "@/types";

interface useDialerModalStore {
  isOpen: boolean;
  onOpen: (e?: FullLead) => void;
  onClose: () => void;
  lead?: FullLead;
}

export const useDialerModal = create<useDialerModalStore>((set) => ({
  isOpen: false,
  onOpen: (e) => set({ isOpen: true, lead: e }),
  onClose: () => set({ isOpen: false }),
}));
