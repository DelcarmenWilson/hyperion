import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { LeadDefaultStatus } from "@/types/lead";

type State = {
  statusId: string;
  vendor: string;
  state: string;
};

type Actions = {
  onSetStatus: (s: string) => void;
  onSetVendor: (v: string) => void;
  onSetState: (s: string) => void;
};

export const useLeadFilterStore = create<State & Actions>()(
  immer((set, get) => ({
    statusId: LeadDefaultStatus.NEW,
    vendor: "%",
    state: "%",

    onSetStatus: (s) => set({ statusId: s }),
    onSetVendor: (v) => set({ vendor: v }),
    onSetState: (s) => set({ state: s }),
  }))
);
