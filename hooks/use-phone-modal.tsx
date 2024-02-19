import { create } from "zustand";
import { FullLead, FullLeadNoConvo } from "@/types";

interface usePhoneModalStore {
  isPhoneInOpen: boolean;
  onPhoneInOpen: () => void;
  onPhoneInClose: () => void;

  isPhoneLeadOpen: boolean;
  onPhoneLeadOpen: () => void;
  onPhoneLeadClose: () => void;

  isPhoneOutOpen: boolean;
  onPhoneOutOpen: (e?: FullLeadNoConvo) => void;
  onPhoneOutClose: () => void;
  lead?: FullLeadNoConvo;
}

export const usePhoneModal = create<usePhoneModalStore>((set) => ({
  isPhoneInOpen: false,
  onPhoneInOpen: () => set({ isPhoneInOpen: true }),
  onPhoneInClose: () => set({ isPhoneInOpen: false }),
  isPhoneLeadOpen: false,
  onPhoneLeadOpen: () => set({ isPhoneLeadOpen: true }),
  onPhoneLeadClose: () => set({ isPhoneLeadOpen: false }),
  isPhoneOutOpen: false,
  onPhoneOutOpen: (e) => set({ isPhoneOutOpen: true, lead: e }),
  onPhoneOutClose: () => set({ isPhoneOutOpen: false }),
}));
