import { LeadColumn } from "@/app/(dashboard)/leads/components/columns";
import { startupClient } from "@/lib/quickstart";
import { PhoneType } from "@/types";
import axios from "axios";
import { Device } from "twilio-client";
import { create } from "zustand";

interface useDialerModalStore {
  isOpen: boolean;
  onOpen: (e?: LeadColumn) => void;
  onClose: () => void;
  // onLoad: (phones?: PhoneType[]) => void;
  // startupClient:(devices:Device[],phones:PhoneType[])=>void
  lead?: LeadColumn;
  // devices?: Device[];
}

export const useDialerModal = create<useDialerModalStore>((set) => ({
  isOpen: false,
  onOpen: (e) => set({ isOpen: true, lead: e }),
  onClose: () => set({ isOpen: false }),
  // onLoad: async (phones?: PhoneType[]) => {
  //   if (!phones) return;
  //   let devs: Device[] = [];
  //   try {
  //     const response = await axios.get("/api/token");
  //     const data = response.data;
  //     const device = new Device(data.token, {
  //       logLevel: 1,
  //     });
  //     devs.push(device);
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   set({ devices: devs });
  // },
}));
