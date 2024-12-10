import { create } from "zustand";

type State = {
  callIds?: string[];
  isMultipleCallDialogOpen: boolean;
};
type Actions = {
  onMultipleCallDialogOpen: (c: string[]) => void;
  onMultipleCallDialogClose: () => void;
};

export const useCallStore = create<State & Actions>((set) => ({
  //MULTIPLE CALL DIALOG
  isMultipleCallDialogOpen: false,
  onMultipleCallDialogOpen: (ids) =>
    set({ callIds: ids, isMultipleCallDialogOpen: true }),
  onMultipleCallDialogClose: () =>
    set({ callIds: undefined, isMultipleCallDialogOpen: false }),
}));