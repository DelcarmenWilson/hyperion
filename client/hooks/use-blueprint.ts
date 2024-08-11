import { create } from "zustand";
import { AgentWorkInfo } from "@prisma/client";

type useBluePrintStore = {
  //POLICY
  workInfo?: AgentWorkInfo;
  isWorkInfoFormOpen: boolean;
  onWorkInfoFormOpen: (w?: AgentWorkInfo) => void;
  onWorkInfoFormClose: () => void;
};

export const useBluePrint = create<useBluePrintStore>((set) => ({
  isWorkInfoFormOpen: false,
  onWorkInfoFormOpen: (w) => set({ workInfo: w, isWorkInfoFormOpen: true }),
  onWorkInfoFormClose: () =>
    set({
      workInfo: undefined,
      isWorkInfoFormOpen: false,
    }),
}));
