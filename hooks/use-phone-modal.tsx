import { create } from "zustand";
import { Device } from "twilio-client";
import { tokenGenerator } from "@/lib/handler";

interface usePhoneModalStore {
  identity: string;
  device: Device | undefined;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLoad: (dv: Device) => void;
  // onLoad: (id: string) => void;
}

export const usePhoneModal = create<usePhoneModalStore>((set) => ({
  identity: "",
  device: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onLoad(dv) {
    set({ device: dv });
    // set({ device: new Device(tokenGenerator(id).token) });
    // set({ device: new Device(tokenGenerator(id).token) });
  },
  // onLoad(id) {
  //   if (this.identity) return;
  //   set({ identity: id });
  //   // set({ device: new Device(tokenGenerator(id).token) });
  //   // set({ device: new Device(tokenGenerator(id).token) });
  // },
}));
