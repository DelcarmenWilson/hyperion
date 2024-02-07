import { create } from "zustand";
import { Device } from "twilio-client";
import { FullLead } from "@/types";

interface usePhoneModalStore {
  device: Device | undefined;
  isPhoneOpen: boolean;
  onPhoneOpen: () => void;
  onPhoneClose: () => void;
  onLoad: (dv: Device) => void;

  isDialerOpen: boolean;
  onDialerOpen: (e?: FullLead) => void;
  onDialerClose: () => void;
  lead?: FullLead;
}

export const usePhoneModal = create<usePhoneModalStore>((set) => ({
  device: undefined,
  isPhoneOpen: false,
  onPhoneOpen: () => set({ isPhoneOpen: true }),
  onPhoneClose: () => set({ isPhoneOpen: false }),
  onLoad(dv) {
    set({ device: dv });
  },
  isDialerOpen: false,
  onDialerOpen: (e) => set({ isDialerOpen: true, lead: e }),
  onDialerClose: () => set({ isDialerOpen: false }),
}));
