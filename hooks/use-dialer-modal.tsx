import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";
import { create } from "zustand";

interface useDialerModalStore {
  isOpen: boolean;
  onOpen: (e?: LeadColumn) => void;
  onClose: () => void;
  lead?: LeadColumn;
}

export const useDialerModal = create<useDialerModalStore>((set) => ({
  isOpen: false,
  onOpen: (e) => set({ isOpen: true, lead: e }),
  onClose: () => set({ isOpen: false }),
  lead: undefined,
}));
