import { FullLeadNoConvo } from "@/types";
import { create } from "zustand";

interface useAppointmentModalStore {
  isOpen: boolean;
  onOpen: (e?: FullLeadNoConvo) => void;
  onClose: () => void;
  lead?: FullLeadNoConvo;
}

export const useAppointmentModal = create<useAppointmentModalStore>((set) => ({
  isOpen: false,
  onOpen: (e) => set({ isOpen: true, lead: e }),
  onClose: () => set({ isOpen: false }),
}));
