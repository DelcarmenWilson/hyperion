import { create } from "zustand";
import { Device } from "twilio-client";
import { FullLead } from "@/types";

interface usePhoneModalStore {
  isPhoneOpen: boolean;
  onPhoneOpen: () => void;
  onPhoneClose: () => void;

  isDialerOpen: boolean;
  onDialerOpen: (e?: FullLead) => void;
  onDialerClose: () => void;
  lead?: FullLead;
}

export const usePhoneModal = create<usePhoneModalStore>((set) => ({
  isPhoneOpen: false,
  onPhoneOpen: () => set({ isPhoneOpen: true }),
  onPhoneClose: () => set({ isPhoneOpen: false }),
  isDialerOpen: false,
  onDialerOpen: (e) => set({ isDialerOpen: true, lead: e }),
  onDialerClose: () => set({ isDialerOpen: false }),
}));
