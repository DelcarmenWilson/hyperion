import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";
import { create } from "zustand";

interface useAppointmentModalStore {
  isOpen: boolean;
  onOpen: (e?: LeadColumn) => void;
  onClose: () => void;
  lead?: LeadColumn;
}

export const useAppointmentModal = create<useAppointmentModalStore>((set) => ({
  isOpen: false,
  onOpen: (e) => set({ isOpen: true, lead: e }),
  onClose: () => set({ isOpen: false }),
}));
