import { create } from "zustand";

type State = {
  selectedNodeId?: string;
  isSidebarOpen: boolean;
  reload: boolean;
};

type Actions = {
  setNodeId: (n: string) => void;
  onSidebarOpen: (b?: string) => void;
  onSidebarClose: () => void;
  onSetReaload: (b: boolean) => void;
};

export const useWorkflowStore = create<State & Actions>((set) => ({
  setNodeId: (n) => set({ selectedNodeId: n }),
  isSidebarOpen: false,
  onSidebarOpen: (n) => set({ selectedNodeId: n, isSidebarOpen: true }),
  onSidebarClose: () =>
    set({ isSidebarOpen: false, selectedNodeId: undefined }),
  //Temporary work around for slect components
  reload: false,
  onSetReaload: (r) => set({ reload: r }),
}));
