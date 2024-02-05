import { FullLead } from "@/types";
import { create } from "zustand";

interface useAppointmentModalStore {
  isOpen: boolean;
  onOpen: (e?: FullLead) => void;
  onClose: () => void;
  lead?: FullLead;
}

export const useAppointmentModal = create<useAppointmentModalStore>((set) => ({
  isOpen: false,
  onOpen: (e) => set({ isOpen: true, lead: e }),
  onClose: () => set({ isOpen: false }),
}));
