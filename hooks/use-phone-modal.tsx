import { create } from "zustand";
import { FullLeadNoConvo } from "@/types";

type usePhoneModalStore = {
  isPhoneInOpen: boolean;
  onPhoneInOpen: () => void;
  onPhoneInClose: () => void;

  isPhoneOutOpen: boolean;
  onPhoneOutOpen: (e?: FullLeadNoConvo) => void;
  onPhoneOutClose: () => void;
  lead?: FullLeadNoConvo;
  onSetLead: (e?: FullLeadNoConvo) => void;
};

export const usePhoneModal = create<usePhoneModalStore>((set) => ({
  isPhoneInOpen: false,
  onPhoneInOpen: () => set({ isPhoneInOpen: true }),
  onPhoneInClose: () => set({ isPhoneInOpen: false }),
  isPhoneOutOpen: false,
  onPhoneOutOpen: (e) => set({ isPhoneOutOpen: true, lead: e }),
  onPhoneOutClose: () => set({ isPhoneOutOpen: false }),
  onSetLead: (e) => set({ lead: e }),
}));
