
import { create } from "zustand";

type useWorkFlowStore = {
  workflowId?:string;
  isTriggerOpen: boolean;
  onTriggerOpen: (w:string) => void;
  onTriggerClose: () => void;  
};

export const useWorkFlow = create<useWorkFlowStore>((set) => ({
  isTriggerOpen: false,
  onTriggerOpen: (w) => set({ workflowId:w, isTriggerOpen: true }),
  onTriggerClose: () => set({ isTriggerOpen: false }),
  
}));
