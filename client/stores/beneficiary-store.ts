import { create } from "zustand";

type State = {
  beneficiaryId?: string;
  isBeneficiaryFormOpen: boolean;
};

type Actions = {
  setBeneficiaryId: (b: string) => void;
  onBeneficiaryFormOpen: (b?: string) => void;
  onBeneficiaryFormClose: () => void;
};

export const useBeneficiaryStore = create<State & Actions>((set) => ({
  setBeneficiaryId: (b) => set({ beneficiaryId: b }),
  isBeneficiaryFormOpen: false,
  onBeneficiaryFormOpen: (b) =>
    set({ beneficiaryId: b, isBeneficiaryFormOpen: true }),
  onBeneficiaryFormClose: () => set({ isBeneficiaryFormOpen: false }),
}));