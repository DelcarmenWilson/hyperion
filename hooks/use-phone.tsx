import { create } from "zustand";
import { FullLead, FullLeadNoConvo } from "@/types";
import { PipeLine } from "@prisma/client";

type phoneStore = {
  isPhoneInOpen: boolean;
  onPhoneInOpen: () => void;
  onPhoneInClose: () => void;

  isPhoneDialerOpen: boolean;
  onPhoneDialerOpen: (e?: FullLead[], f?: PipeLine) => void;
  onPhoneDialerClose: () => void;

  isPhoneOutOpen: boolean;
  onPhoneOutOpen: (e?: FullLeadNoConvo) => void;
  onPhoneOutClose: () => void;

  lead?: FullLeadNoConvo;
  leads?: FullLead[];
  pipeline?: PipeLine;
  onSetLead: (e?: FullLeadNoConvo) => void;
  onSetLeads: (e?: FullLead[]) => void;
};

export const usePhone = create<phoneStore>((set) => ({
  isPhoneInOpen: false,
  onPhoneInOpen: () => set({ isPhoneInOpen: true }),
  onPhoneInClose: () => set({ isPhoneInOpen: false }),
  isPhoneDialerOpen: false,
  onPhoneDialerOpen: (e, f) =>
    set({ isPhoneDialerOpen: true, leads: e, pipeline: f }),
  onPhoneDialerClose: () => set({ isPhoneDialerOpen: false }),
  isPhoneOutOpen: false,
  onPhoneOutOpen: (e) => set({ isPhoneOutOpen: true, lead: e }),
  onPhoneOutClose: () => set({ isPhoneOutOpen: false }),
  onSetLead: (e) => set({ lead: e }),
  onSetLeads: (e) => set({ leads: e }),
}));