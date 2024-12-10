import { create } from "zustand";

type State = {
  conditionId?: string;
};

type Actions = {
  setConditionId: (c: string) => void;
  isConditionFormOpen: boolean;
  onConditionFormOpen: (c?: string) => void;
  onConditionFormClose: () => void;
};

export const useLeadConditionStore = create<State & Actions>((set) => ({
  setConditionId: (c) => set({ conditionId: c }),
  isConditionFormOpen: false,
  onConditionFormOpen: (c) =>
    set({ conditionId: c, isConditionFormOpen: true }),
  onConditionFormClose: () => set({ isConditionFormOpen: false }),
}));
